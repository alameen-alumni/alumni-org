import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const NoticeEvents = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 1 }
    }
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticeEvents = async () => {
      setLoading(true);
      try {
        const [NoticeSnap, eventsSnap] = await Promise.all([
          getDocs(collection(db, 'notice')),
          getDocs(collection(db, 'events')),
        ]);
        const Notice = NoticeSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as { date?: string }), type: 'Notice' }));
        const events = eventsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as { date?: string }), type: 'event' }));
        // Combine and sort by date descending (assuming date is string or timestamp)
        const combined = [...Notice, ...events].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        setItems(combined.slice(0, 6));
      } catch (error) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticeEvents();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="sm:py-16 bg-[#F9F7F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1F1F1F] mb-4">
            Latest Notice & Events
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#186F65] to-[#B2533E] mx-auto mb-4"></div>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Stay connected with our vibrant alumni community and upcoming initiatives
          </p>
        </div>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {loading ? (
                <div className="flex-1 text-center py-12">Loading...</div>
              ) : items.length === 0 ? (
                <div className="flex-1 text-center py-12">No Notice or events found.</div>
              ) : (
                items.map((item, index) => (
                  <div key={item.id} className="flex-[0_0_100%] md:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-[#186F65]/10 h-full">
                      <div className="relative h-48 md:h-48">
                        <img 
                          src={item.image || 'https://via.placeholder.com/800x400'} 
                          alt={item.title || 'Notice/Event'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-[#186F65] text-white px-3 py-1 rounded-full text-sm flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {item.date || 'N/A'}
                        </div>
                        <div className="absolute top-4 right-4 bg-[#B2533E] text-white px-3 py-1 rounded-full text-xs">
                          {item.category || (item.type === 'Notice' ? 'Notice' : 'Event')}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-semibold text-[#1F1F1F] mb-3">
                          {item.title || 'Untitled'}
                        </h3>
                        <p className="text-[#666666] mb-4 leading-relaxed">
                          {item.description || 'No description available.'}
                        </p>
                        <Link to={item.type === 'event' ? '/events' : '/notice'} className="flex items-center text-[#186F65] hover:text-[#B2533E] font-medium transition-colors group">
                          Read more
                          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Navigation Arrows */}
          <button 
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:bg-[#186F65] hover:text-white group"
          >
            <ChevronLeft size={24} className="text-[#666666] group-hover:text-white" />
          </button>
          <button 
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:bg-[#186F65] hover:text-white group"
          >
            <ChevronRight size={24} className="text-[#666666] group-hover:text-white" />
          </button>
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  index === selectedIndex ? 'bg-[#186F65] scale-125' : 'bg-[#186F65]/30 hover:bg-[#186F65]/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeEvents;
