import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, limit, orderBy, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type GalleryItem } from '../types';
import { galleryState } from '../state/atoms';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const ITEMS_PER_PAGE = 10;

export const useGallery = () => {
  const [gallery, setGallery] = useRecoilState(galleryState);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchGalleryItems = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setGallery(prev => ({ ...prev, loading: true, error: null }));
      }
      
      let galleryQuery = query(
        collection(db, 'gallery'),
        orderBy('sl_no', 'asc'),
        limit(ITEMS_PER_PAGE)
      );

      if (isLoadMore && lastDoc) {
        galleryQuery = query(
          collection(db, 'gallery'),
          orderBy('sl_no', 'asc'),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(galleryQuery);
      const items = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as GalleryItem[];
      
      // Sort items by sl_no (1 to n first, then 0 or undefined)
      const sortedItems = items.sort((a, b) => {
        const aSlNo = typeof a.sl_no === 'string' ? parseInt(a.sl_no) : a.sl_no;
        const bSlNo = typeof b.sl_no === 'string' ? parseInt(b.sl_no) : b.sl_no;
        
        if (aSlNo !== undefined && aSlNo > 0 && bSlNo !== undefined && bSlNo > 0) {
          return aSlNo - bSlNo;
        }
        if (aSlNo !== undefined && aSlNo > 0 && (bSlNo === undefined || bSlNo === 0)) {
          return -1;
        }
        if (bSlNo !== undefined && bSlNo > 0 && (aSlNo === undefined || aSlNo === 0)) {
          return 1;
        }
        return 0;
      });
      
      if (isLoadMore) {
        setGallery(prev => ({
          ...prev,
          items: [...prev.items, ...sortedItems],
          loading: false,
          error: null,
          lastFetched: Date.now(),
        }));
      } else {
        setGallery({
          items: sortedItems,
          loading: false,
          error: null,
          lastFetched: Date.now(),
        });
      }

      // Update pagination state
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);
      setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
      
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setGallery(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load gallery items',
      }));
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (hasMore && !loadingMore) {
      await fetchGalleryItems(true);
    }
  };

  const shouldFetch = () => {
    const now = Date.now();
    return (
      gallery.items.length === 0 ||
      gallery.lastFetched === null ||
      (now - gallery.lastFetched) > CACHE_DURATION
    );
  };

  useEffect(() => {
    if (shouldFetch()) {
      fetchGalleryItems();
    }
  }, []);

  const refreshGallery = async () => {
    setLastDoc(null);
    setHasMore(true);
    await fetchGalleryItems();
  };

  return {
    items: gallery.items,
    loading: gallery.loading,
    loadingMore,
    error: gallery.error,
    hasMore,
    refreshGallery,
    loadMore,
  };
}; 