
import { useState, useEffect } from 'react';

const MissionGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryItems = [
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Campus Heritage'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Student Activities'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Academic Excellence'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Alumni Success'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Community Impact'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryItems.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [galleryItems.length]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Mission Gallery
          </h2>
          <p className="text-lg text-gray-600">
            Celebrating our journey, achievements, and community spirit
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {galleryItems.concat(galleryItems).map((item, index) => (
              <div key={index} className="w-1/3 flex-shrink-0 px-2">
                <div className="relative group cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <img 
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionGallery;
