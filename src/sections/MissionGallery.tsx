import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import image1 from '/msn-frnt.jpg'
import image2 from '/mssn-side.jpg'
import charity1 from '/charity1.jpg'

const MissionGallery = () => {
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

  const galleryItems = [
    {
      type: 'image',
      src: image1,
      title: 'Historic Campus Heritage',
      description: 'Our beautiful campus reflecting traditional Islamic architecture and educational excellence'
    },
    {
      type: 'image',
      src: image2,
      title: 'Reunion Event',
      description: 'Vibrant campus life with diverse cultural and academic programs fostering holistic development'
    },
    {
      type: 'image',
      src: charity1,
      title: 'Charity Campaign',
      description: 'Charity campaign by our beloved alumni community'
    },
  ];

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
    }, 6000);

    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1F1F1F] mb-4">
            Mission Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#186F65] to-[#B2533E] mx-auto mb-4"></div>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Capturing moments, memories, and milestones of our mission's journey
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {galleryItems.map((item, index) => (
                <div key={index} className="flex-[0_0_100%] md:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6">
                  <div className="relative group cursor-pointer transition-all duration-300 h-full">
                    <div className="aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
                      <img 
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg">
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-serif font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-[#F9F7F1]/80">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

          {/* Manual Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
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

export default MissionGallery;
