import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useGallery } from "../hooks/use-gallery";
import { Link } from "react-router-dom";

const MissionGallery = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 1 },
    },
  });

  const [isHovered, setIsHovered] = useState(false);

  const { items: galleryItems, loading } = useGallery();



  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);



  useEffect(() => {
    if (!emblaApi || isHovered) return;

    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500); // Changed to 2 seconds

    return () => clearInterval(timer);
  }, [emblaApi, isHovered]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1F1F1F] mb-4">
              Mission Gallery
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#186F65] to-[#B2533E] mx-auto mb-4"></div>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Loading gallery images...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (galleryItems.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1F1F1F] mb-4">
              Mission Gallery
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#186F65] to-[#B2533E] mx-auto mb-4"></div>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              No gallery images available yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6 sm:mt-0 sm:py-16 pb-12 bg-white">
      <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-8">
        <div className="text-center mb-4 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1F1F1F] mb-4">
            Mission Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#186F65] to-[#B2533E] mx-auto mb-4"></div>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Capturing moments, memories, and milestones of our mission's journey
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden h-56 md:h-96 py-3" ref={emblaRef}>
            <div className="flex">
              {galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex-[0_0_100%] md:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6"
                >
                                     <div
                     className="relative group cursor-pointer transition-all duration-300 h-full"
                   >
                    <div className="aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg">
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-serif font-semibold mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#F9F7F1]/80">
                          {item.description}
                        </p>
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
            <ChevronLeft
              size={24}
              className="text-[#666666] group-hover:text-white"
            />
          </button>
                     <button
             onClick={scrollNext}
             className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:bg-[#186F65] hover:text-white group"
           >
             <ChevronRight
               size={24}
               className="text-[#666666] group-hover:text-white"
             />
           </button>
         </div>

         {/* View All Images Button */}
         <div className="text-center mt-8">
           <Link
             to="/gallery"
             className="inline-flex items-center px-6 py-3 bg-[#186F65] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
           >
             View All Images
             <ChevronRight size={20} className="ml-2" />
           </Link>
         </div>
       </div>
     </section>
   );
 };

export default MissionGallery;
