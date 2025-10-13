import { db } from '@/lib/firebase';
import { createMultiIdCardPdfBlob } from '@/lib/idcard';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useCallback, useState } from 'react';

type Progress = { total: number; completed: number; currentUserId?: string; error?: string | null };

export function useGenerateIdCards() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);

  const generateRange = useCallback(async (opts: {
    collectionName?: string;
    orderByField?: string;
    startIndex: number;
    endIndex: number;
    templateUrl: string;
    nameField?: string;
    batchField?: string;
    serialField?: string;
    onEach?: (info: { userId: string; url?: string; idx: number }) => void;
    onLog?: (msg: string) => void;
    layoutOptions?: import('@/lib/idcard').IdCardLayoutOptions;
  }) => {
    const {
      collectionName = 'alumni',
      orderByField = 'sl_no',
      startIndex,
      endIndex,
      templateUrl,
      nameField = 'name',
      batchField = 'batch',
      serialField = 'sl_no',
      onEach,
      onLog,
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
      setProgress({ total: slice.length, completed: 0 });

      const items: Array<{ name: string; idText: string; batchText: string; userId: string; idx: number }> = [];
      const skipped: string[] = [];

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
        setProgress((p) => (p ? { ...p, currentUserId: u.id } : null));
        try {
          const nameVal = getByPath(u, nameField) ?? u['name'] ?? u['fullName'];
          const batchVal = getByPath(u, batchField);
          const serialVal = getByPath(u, serialField);

          const missing: string[] = [];
          if (!batchVal) missing.push(`batch (${batchField})`);
          if (serialVal === undefined || serialVal === null || serialVal === '') missing.push(`serial (${serialField})`);
          if (missing.length) {
            const msg = `Skipping user ${u.id}: missing required fields: ${missing.join(', ')}`;
            skipped.push(msg);
            setProgress((p) => (p ? { ...p, error: msg } : { total: slice.length, completed: 0, error: msg }));
            continue;
          }

          const name = String(nameVal ?? '');
          const batchText = String(batchVal ?? '');
          const serialValue = String(serialVal ?? '');
          const idText = `${serialValue}`;

          items.push({ name, idText, batchText, userId: u.id, idx });
          onEach?.({ userId: u.id, url: undefined, idx });
          setProgress((p) => (p ? { ...p, completed: p.completed + 1 } : { total: slice.length, completed: 1 }));
        } catch (e) {
          const m = e instanceof Error ? e.message : String(e);
          skipped.push(`Error for ${u.id}: ${m}`);
          setProgress((p) => (p ? { ...p, error: m } : { total: slice.length, completed: 0, error: m }));
        }
      }

      if (items.length === 0) return { generatedFiles: [], skipped, errors: skipped.length ? skipped : undefined };

      try {
        const blob = await createMultiIdCardPdfBlob(
          templateUrl,
          items.map((it) => ({ name: it.name, idText: it.idText, batchText: it.batchText })),
          opts.layoutOptions
        );
        onLog?.(`Created combined PDF blob size=${(typeof blob.size === 'number') ? blob.size : 'unknown'}`);
        const fileName = `idcards_${startIndex}_${endIndex}.pdf`;
        const generatedFiles: Array<{ fileName: string; blob: Blob; url?: string; userId: string }> = [{ fileName, blob, userId: 'combined' }];

        // notify per-user that generation finished and provide no remote URL (blob available in generatedFiles)
        for (const it of items) {
          try { onEach?.({ userId: it.userId, url: undefined, idx: it.idx }); } catch (e) { void e; }
        }

        return { generatedFiles, skipped, errors: skipped.length ? skipped : undefined };
      } catch (e) {
        const m = e instanceof Error ? e.message : String(e);
        skipped.push(`Failed to create combined PDF: ${m}`);
        onLog?.(`Failed to create combined PDF: ${m}`);
        return { generatedFiles: [], skipped, errors: skipped.length ? skipped : undefined };
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, progress, generateRange };
}

