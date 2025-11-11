
import { useEffect, useState } from 'react';
import Hero from '../sections/Hero';
import NewsEvents from '../sections/NewsEvents';
import FeaturedDonors from '../sections/FeaturedDonors';
import MissionGallery from '../sections/MissionGallery';
import NotificationModal from '../components/NotificationModal';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useModal } from '../contexts/ModalContext';

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState(null);
  const { shown, setShown } = useModal();

  useEffect(() => {
    // Only show modal once per app session
    if (!shown) {
      const timer = setTimeout(() => {
        setShowModal(true);
        setShown(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shown, setShown]);

  useEffect(() => {
    // Fetch the visible modal with localStorage caching
    const fetchModal = async () => {
      try {
        // Check localStorage first
        const cachedData = localStorage.getItem('modalData');
        const cachedTimestamp = localStorage.getItem('modalTimestamp');
        const now = Date.now();
        const cacheAge = 5 * 60 * 1000; // 5 minutes

        // Use cached data if it's fresh
        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp)) < cacheAge) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData && parsedData.visible) {
            setModal(parsedData);
            return;
          }
        }

        // Fetch fresh data from Firestore
        const querySnapshot = await getDocs(collection(db, 'modal'));
        const visibleModal = querySnapshot.docs.find(doc => doc.data().visible === true);
        
        if (visibleModal) {
          const modalData = { id: visibleModal.id, ...visibleModal.data() };
          setModal(modalData);
          
          // Cache the data
          localStorage.setItem('modalData', JSON.stringify(modalData));
          localStorage.setItem('modalTimestamp', now.toString());
        } else {
          setModal(null);
          // Clear cache if no visible modal
          localStorage.removeItem('modalData');
          localStorage.removeItem('modalTimestamp');
        }
      } catch (err) {
        console.error('Error fetching modal:', err);
        setModal(null);
      }
    };

    fetchModal();
    // Show modal after 2 seconds
    const timer = setTimeout(() => setShowModal(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for storage changes (when admin updates modal)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'modalData' || e.key === 'modalTimestamp') {
        // Refetch modal data when cache is updated
        const fetchModal = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, 'modal'));
            const visibleModal = querySnapshot.docs.find(doc => doc.data().visible === true);
            
            if (visibleModal) {
              const modalData = { id: visibleModal.id, ...visibleModal.data() };
              setModal(modalData);
              
              // Update cache
              localStorage.setItem('modalData', JSON.stringify(modalData));
              localStorage.setItem('modalTimestamp', Date.now().toString());
            } else {
              setModal(null);
              localStorage.removeItem('modalData');
              localStorage.removeItem('modalTimestamp');
            }
          } catch (err) {
            console.error('Error refetching modal:', err);
          }
        };
        fetchModal();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div>
      <Hero />
      <NewsEvents />
      <FeaturedDonors />
      <MissionGallery />
      <NotificationModal open={showModal && !!modal} onOpenChange={setShowModal} notice={modal} />
    </div>
  );
};

export default Index;
