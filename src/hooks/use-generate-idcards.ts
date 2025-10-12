import { db, storage } from '@/lib/firebase';
import { createIdCardPdfBlob } from '@/lib/idcard';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { useCallback, useState } from 'react';

type Progress = {
  total: number;
  completed: number;
  currentUserId?: string;
  error?: string | null;
};

export function useGenerateIdCards() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);

  const generateRange = useCallback(async (opts: {
    collectionName?: string;
    orderByField?: string;
    startIndex: number;
    endIndex: number;
    templateUrl: string;
    outputFolder?: string;
    nameField?: string;
    batchField?: string;
    serialField?: string;
    onEach?: (info: { userId: string; url?: string; idx: number }) => void;
  }) => {
    const {
      collectionName = 'alumni',
      orderByField = 'sl_no',
      startIndex,
      endIndex,
      templateUrl,
      outputFolder = 'idcards',
      nameField = 'name',
      batchField = 'batch',
      serialField = 'sl_no',
      onEach,
    } = opts;

    setLoading(true);
    setProgress({ total: endIndex - startIndex + 1, completed: 0 });

    try {
      const coll = collection(db, collectionName);
      let q;
      try {
        q = query(coll, orderBy(orderByField));
      } catch {
        q = query(coll);
      }
  const snapshot = await getDocs(q);
  const allUsers = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));

      const slice = allUsers.slice(startIndex - 1, endIndex);

      // Pre-validate required fields for the selected range
      for (let i = 0; i < slice.length; i++) {
        const u = slice[i] as Record<string, unknown> & { id: string };
        const missing: string[] = [];
        const nameVal = u[nameField] ?? u.name ?? u.fullName;
        if (!nameVal) missing.push(`name (${nameField})`);
        if (!u[batchField]) missing.push(`batch (${batchField})`);
        if (u[serialField] === undefined || u[serialField] === null || u[serialField] === '') missing.push(`serial (${serialField})`);
        if (missing.length) {
          const msg = `Missing required fields for user ${u.id}: ${missing.join(', ')}`;
          setProgress((p) => p ? { ...p, error: msg } : null);
          throw new Error(msg);
        }
      }

      for (let i = 0; i < slice.length; i++) {
        const u = slice[i] as Record<string, unknown> & { id: string };
        const idx = startIndex - 1 + i;
        setProgress((p) => p ? { ...p, currentUserId: u.id } : null);

        try {
          const name = String(u[nameField] ?? u['name'] ?? u['fullName'] ?? '');
          const batchText = String(u[batchField] ?? '');
          const serialValue = String(u[serialField] ?? '');
          const idText = `ID-${serialValue}`;

          const pdfBlob = await createIdCardPdfBlob(templateUrl, name, idText, batchText);

          const fileName = `${u.id}_${Date.now()}.pdf`;
          const sRef = storageRef(storage, `${outputFolder}/${fileName}`);
          // uploadBytes expects a Blob | Uint8Array | ArrayBuffer
          const uploadRes = await uploadBytes(sRef, await pdfBlob.arrayBuffer());
          const url = await getDownloadURL(uploadRes.ref);

          const idCardDoc = {
            userId: u.id,
            name,
            batch: batchText,
            idNumber: idText,
            storagePath: `${outputFolder}/${fileName}`,
            url,
            generatedAt: new Date().toISOString(),
          };

          await addDoc(collection(db, 'id_cards'), idCardDoc);

          onEach?.({ userId: u.id, url, idx });
          setProgress((p) => p ? { ...p, completed: (p.completed + 1) } : null);
        } catch (userErr) {
          const message = (userErr instanceof Error) ? userErr.message : String(userErr);
          console.error('Error generating for user', u.id, userErr);
          setProgress((p) => p ? { ...p, error: message } : null);
          // continue with next user
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, progress, generateRange };
}
