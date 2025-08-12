import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit, orderBy, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ITEMS_PER_PAGE = 12;

export interface AlumniItem {
  id: string;
  name: string;
  reg_id: number;
  designation?: string;
  category?: string;
  contact?: string;
  location?: string;
  passout_year?: string;
  featured?: boolean;
  image?: string;
}

export const useAlumniPagination = () => {
  const [alumni, setAlumni] = useState<AlumniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchAlumni = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      let alumniQuery = query(
        collection(db, 'alumni_db'),
        orderBy('reg_id', 'asc'),
        limit(ITEMS_PER_PAGE)
      );

      if (isLoadMore && lastDoc) {
        alumniQuery = query(
          collection(db, 'alumni_db'),
          orderBy('reg_id', 'asc'),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(alumniQuery);
      const items = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as AlumniItem[];
      
      if (isLoadMore) {
        setAlumni(prev => [...prev, ...items]);
      } else {
        setAlumni(items);
      }

      // Update pagination state
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);
      setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
      
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setError('Failed to load alumni data');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (hasMore && !loadingMore) {
      await fetchAlumni(true);
    }
  };

  const refreshAlumni = async () => {
    setLastDoc(null);
    setHasMore(true);
    await fetchAlumni();
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  return {
    alumni,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refreshAlumni,
  };
};
