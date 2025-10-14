import { db } from '@/lib/firebase';
import { createMultiIdCardPdfBlob } from '@/lib/idcard';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
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
    presenceFilter?: string[];
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
      presenceFilter = [],
      onEach,
      onLog,
    } = opts;

    setLoading(true);
    try {
      const coll = collection(db, collectionName);

      // Get all users in the range first to check what exists vs what matches filter
      const allUsersQuery = query(
        coll,
        where(orderByField, '>=', startIndex),
        where(orderByField, '<=', endIndex),
        orderBy(orderByField)
      );
      const allSnapshot = await getDocs(allUsersQuery);
      const allUsersInRange = allSnapshot.docs.map((d) => ({
        id: d.id,
        sl_no: d.data()[orderByField] as number,
        name: d.data()[nameField || 'name'] as string,
        event: d.data().event as { present?: string } | undefined,
        ...d.data() as Record<string, unknown>
      }));

      // Create map of expected sl_no values
      const expectedSlNos = Array.from(
        { length: endIndex - startIndex + 1 },
        (_, i) => startIndex + i
      );

      // Track results for table
      const successful: Array<{ sl_no: number; name: string; status: string }> = [];
      const missed: Array<{ sl_no: number; name: string; status: string; reason: string }> = [];

      // Filter by presence if specified
      let filteredUsers = allUsersInRange;
      if (presenceFilter.length > 0) {
        onLog?.(`Filtering by event.present: ${presenceFilter.join(', ')}`);
        filteredUsers = allUsersInRange.filter(user => {
          const eventPresent = user.event?.present;
          return presenceFilter.includes(eventPresent as string);
        });

        // Track missed due to presence filter
        for (const user of allUsersInRange) {
          if (!filteredUsers.includes(user)) {
            const actualPresence = user.event?.present || 'not set';
            missed.push({
              sl_no: user.sl_no,
              name: user.name || 'Unknown',
              status: actualPresence,
              reason: `event.present = "${actualPresence}" (filter: [${presenceFilter.join(', ')}])`
            });
          }
        }
      }

      // Track missing sl_no entries (users that don't exist in database)
      for (const expectedSlNo of expectedSlNos) {
        const found = allUsersInRange.find(user => user.sl_no === expectedSlNo);
        if (!found) {
          missed.push({
            sl_no: expectedSlNo,
            name: 'Not Found',
            status: 'N/A',
            reason: 'User not found in database'
          });
        }
      }

      setProgress({ total: filteredUsers.length, completed: 0 });

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

      for (let i = 0; i < filteredUsers.length; i++) {
        const u = filteredUsers[i] as Record<string, unknown> & { id: string };
        const idx = i;
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
            setProgress((p) => (p ? { ...p, error: msg } : { total: filteredUsers.length, completed: 0, error: msg }));
            continue;
          }

          const name = String(nameVal ?? '');
          const batchText = String(batchVal ?? '');
          const serialValue = String(serialVal ?? '');
          const idText = `${serialValue}`;
          const sl_no = parseInt(serialValue);

          // Track successful generation
          const userWithEvent = u as Record<string, unknown> & { event?: { present?: string } };
          const eventPresent = userWithEvent?.event?.present || 'not set';
          successful.push({
            sl_no,
            name,
            status: eventPresent
          });

          items.push({ name, idText, batchText, userId: u.id, idx });
          onEach?.({ userId: u.id, url: undefined, idx });
          setProgress((p) => (p ? { ...p, completed: p.completed + 1 } : { total: filteredUsers.length, completed: 1 }));
        } catch (e) {
          const m = e instanceof Error ? e.message : String(e);
          skipped.push(`Error for ${u.id}: ${m}`);
          setProgress((p) => (p ? { ...p, error: m } : { total: filteredUsers.length, completed: 0, error: m }));
        }
      }

      if (items.length === 0) return {
        generatedFiles: [],
        skipped,
        errors: skipped.length ? skipped : undefined,
        summary: { successful, missed }
      };

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

        return {
          generatedFiles,
          skipped,
          errors: skipped.length ? skipped : undefined,
          summary: { successful, missed }
        };
      } catch (e) {
        const m = e instanceof Error ? e.message : String(e);
        skipped.push(`Failed to create combined PDF: ${m}`);
        onLog?.(`Failed to create combined PDF: ${m}`);
        return {
          generatedFiles: [],
          skipped,
          errors: skipped.length ? skipped : undefined,
          summary: { successful, missed }
        };
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, progress, generateRange };
}

