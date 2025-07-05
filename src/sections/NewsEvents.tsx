import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

const NewsEvents = () => {
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

  const events = [
    {
      id: 1,
      title: "Annual Alumni Reunion 2024",
      description: "Join us for the grand reunion featuring cultural programs, networking sessions, and felicitation ceremony for distinguished alumni.",
      date: "March 15, 2024",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Event"
    },
    {
      id: 2,
      title: "Mission Scholarship Fund Launch",
      description: "New scholarship initiative to support meritorious students from underprivileged backgrounds, continuing our mission's legacy.",
      date: "February 28, 2024",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Announcement"
    },
    {
      id: 3,
      title: "Career Guidance Workshop",
      description: "Professional development session by successful alumni mentors covering industry insights and career opportunities.",
      date: "January 25, 2024",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Workshop"
    },
    {
      id: 4,
      title: "Community Service Drive",
      description: "Social outreach program in collaboration with local NGOs focusing on education and healthcare in rural areas.",
      date: "December 20, 2023",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Community"
    },
    {
      id: 5,
      title: "Alumni Mentorship Program",
      description: "Connect current students with successful alumni for career guidance and professional development opportunities.",
      date: "November 15, 2023",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Program"
    },
    {
      id: 6,
      title: "Cultural Festival 2024",
      description: "Annual cultural celebration showcasing diverse talents and fostering community spirit among alumni and students.",
      date: "October 30, 2023",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Festival"
    }
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
    }, 5000);

    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="py-16 bg-[#F9F7F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1F1F1F] mb-4">
            Latest News & Events
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#186F65] to-[#B2533E] mx-auto mb-4"></div>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Stay connected with our vibrant alumni community and upcoming initiatives
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {events.map((event, index) => (
                <div key={event.id} className="flex-[0_0_100%] md:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-[#186F65]/10 h-full">
                    <div className="relative h-48 md:h-48">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-[#186F65] text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {event.date}
                      </div>
                      <div className="absolute top-4 right-4 bg-[#B2533E] text-white px-3 py-1 rounded-full text-xs">
                        {event.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-semibold text-[#1F1F1F] mb-3">
                        {event.title}
                      </h3>
                      <p className="text-[#666666] mb-4 leading-relaxed">
                        {event.description}
                      </p>
                      <button className="flex items-center text-[#186F65] hover:text-[#B2533E] font-medium transition-colors group">
                        Read more
                        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
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

          {/* Dots Indicator */}
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

export default NewsEvents;
