import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GalleryItem } from '../types/gallery';

interface GalleryContextType {
  galleryItems: GalleryItem[];
  loading: boolean;
  error: string | null;
  refreshGallery: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

interface GalleryProviderProps {
  children: ReactNode;
}

export const GalleryProvider = ({ children }: GalleryProviderProps) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
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
      
      setGalleryItems(sortedItems);
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      setError('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const refreshGallery = async () => {
    await fetchGalleryItems();
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const value = {
    galleryItems,
    loading,
    error,
    refreshGallery,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
}; 