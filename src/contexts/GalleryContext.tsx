import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, query, limit, orderBy, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type GalleryItem } from '../types';

interface GalleryContextType {
  galleryItems: GalleryItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  refreshGallery: () => Promise<void>;
  loadMore: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

interface GalleryProviderProps {
  children: React.ReactNode;
}

const ITEMS_PER_PAGE = 10;

export const GalleryProvider = ({ children }: GalleryProviderProps) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchGalleryItems = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
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
        setGalleryItems(prev => [...prev, ...sortedItems]);
      } else {
        setGalleryItems(sortedItems);
      }

      // Update pagination state
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);
      setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
      
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      setError('Failed to load gallery items');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (hasMore && !loadingMore) {
      await fetchGalleryItems(true);
    }
  };

  const refreshGallery = async () => {
    setLastDoc(null);
    setHasMore(true);
    await fetchGalleryItems();
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const value = {
    galleryItems,
    loading,
    loadingMore,
    error,
    hasMore,
    refreshGallery,
    loadMore,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGalleryContext = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }
  return context;
}; 