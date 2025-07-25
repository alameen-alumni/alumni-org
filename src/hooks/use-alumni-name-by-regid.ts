import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { useDebouncedValue } from './use-debounced-value';

export function useAlumniNameByRegId(reg_id, shouldFetch) {
  const [alumniName, setAlumniName] = useState('');
  const [regIdExists, setRegIdExists] = useState(false);
  const debouncedRegId = useDebouncedValue(reg_id, 400);

  useEffect(() => {
    if (!debouncedRegId || String(debouncedRegId).length < 3 || !shouldFetch) {
      setAlumniName('');
      setRegIdExists(false);
      return;
    }
    let cancelled = false;
    const fetchName = async () => {
      // 1. Check reunion collection for existing registration
      const reunionQuery = query(
        collection(db, 'reunion'),
        where('reg_id', '==', Number(debouncedRegId)),
        limit(1)
      );
      const reunionSnap = await getDocs(reunionQuery);
      if (cancelled) return;
      if (!reunionSnap.empty) {
        setAlumniName('');
        setRegIdExists(false);
        return;
      }
      // 2. Check alumni_db for name
      const alumniQuery = query(
        collection(db, 'alumni_db'),
        where('reg_id', '==', Number(debouncedRegId)),
        limit(1)
      );
      const alumniSnap = await getDocs(alumniQuery);
      if (cancelled) return;
      if (!alumniSnap.empty) {
        const alumniData = alumniSnap.docs[0].data();
        setAlumniName(alumniData.name || '');
        setRegIdExists(true);
      } else {
        setAlumniName('');
        setRegIdExists(false);
      }
    };
    fetchName();
    return () => { cancelled = true; };
  }, [debouncedRegId, shouldFetch]);
  return { alumniName, regIdExists };
} 