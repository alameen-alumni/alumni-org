
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

const NewsEvents = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(events.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(events.length / 2)) % Math.ceil(events.length / 2));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

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
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(events.length / 2) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 gap-8">
                    {events.slice(slideIndex * 2, slideIndex * 2 + 2).map((event) => (
                      <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#186F65]/10">
                        <div className="relative h-48">
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
                          <p className="text-[#666666] mb-4 line-clamp-3 leading-relaxed">
                            {event.description}
                          </p>
                          <button className="flex items-center text-[#186F65] hover:text-[#B2533E] font-medium transition-colors group">
                            Read more
                            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:bg-[#186F65] hover:text-white group"
          >
            <ChevronLeft size={24} className="text-[#666666] group-hover:text-white" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:bg-[#186F65] hover:text-white group"
          >
            <ChevronRight size={24} className="text-[#666666] group-hover:text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(events.length / 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-[#186F65] scale-125' : 'bg-[#186F65]/30'
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
