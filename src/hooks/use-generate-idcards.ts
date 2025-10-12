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

  // Set progress total to actual number of items we'll attempt
  setProgress({ total: slice.length, completed: 0 });

  const generatedFiles: Array<{ fileName: string; blob: Blob; url?: string; userId: string }> = [];
  const skipped: string[] = [];

      // helper to resolve nested paths like 'education.passout_year'
      const getByPath = (obj: Record<string, unknown>, path: string | undefined) => {
        if (!path) return undefined;
        if (path.indexOf('.') === -1) return obj[path as string];
        const parts = path.split('.');
        let cur: unknown = obj;
        for (const p of parts) {
          if (cur == null || typeof cur !== 'object') return undefined;
          cur = (cur as Record<string, unknown>)[p];
        }
        return cur;
      };

      for (let i = 0; i < slice.length; i++) {
        const u = slice[i] as Record<string, unknown> & { id: string };
        const idx = startIndex - 1 + i;
        setProgress((p) => p ? { ...p, currentUserId: u.id } : null);
        try {
          // resolve fields (support nested paths)
          const nameVal = getByPath(u, nameField) ?? u['name'] ?? u['fullName'];
          const batchVal = getByPath(u, batchField);
          const serialVal = getByPath(u, serialField);

          const missing: string[] = [];
          if (!batchVal) missing.push(`batch (${batchField})`);
          if (serialVal === undefined || serialVal === null || serialVal === '') missing.push(`serial (${serialField})`);

          if (missing.length) {
            const msg = `Skipping user ${u.id}: missing required fields: ${missing.join(', ')}`;
            console.warn(msg);
            skipped.push(msg);
            // register the skip as an error in progress so UI can show it
            setProgress((p) => p ? { ...p, error: msg } : { total: slice.length, completed: 0, error: msg });
            // continue to next user without throwing
            continue;
          }

          const name = String(nameVal ?? '');
          const batchText = String(batchVal ?? '');
          const serialValue = String(serialVal ?? '');
          const idText = `ID-${serialValue}`;

          const pdfBlob = await createIdCardPdfBlob(templateUrl, name, idText, batchText);

          const fileName = `${u.id}_${Date.now()}.pdf`;
          const sRef = storageRef(storage, `${outputFolder}/${fileName}`);
          // uploadBytes expects a Blob | Uint8Array | ArrayBuffer
          const uploadRes = await uploadBytes(sRef, await pdfBlob.arrayBuffer());
          const url = await getDownloadURL(uploadRes.ref);

          // collect the generated PDF blob for optional zipping/download
          generatedFiles.push({ fileName, blob: pdfBlob, url, userId: u.id });

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
          setProgress((p) => p ? { ...p, completed: (p.completed + 1) } : { total: slice.length, completed: 1 });
        } catch (userErr) {
          const message = (userErr instanceof Error) ? userErr.message : String(userErr);
          console.error('Error generating for user', u.id, userErr);
          setProgress((p) => p ? { ...p, error: message } : { total: slice.length, completed: 0, error: message });
          // continue with next user
        }
      }
      return { generatedFiles, skipped };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, progress, generateRange };
}
