import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GalleryItem } from '../types/gallery';
import { galleryState } from '../state/atoms';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const useGallery = () => {
  const [gallery, setGallery] = useRecoilState(galleryState);

  const fetchGalleryItems = async () => {
    try {
      setGallery(prev => ({ ...prev, loading: true, error: null }));
      
      const querySnapshot = await getDocs(collection(db, 'gallery'));
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
      
      setGallery({
        items: sortedItems,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setGallery(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load gallery items',
      }));
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
    await fetchGalleryItems();
  };

  return {
    items: gallery.items,
    loading: gallery.loading,
    error: gallery.error,
    refreshGallery,
  };
}; 