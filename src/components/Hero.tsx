
const Hero = () => {
  return (
    <div className="relative h-96 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Alumni Association Midnapur
          </h1>
          <h2 className="text-xl md:text-2xl font-medium mb-2 animate-fade-in">
            Alumni Mission Academy
          </h2>
          <p className="text-sm md:text-base opacity-90 animate-fade-in">
            Midnapur Post Street, Midnapur
          </p>
          <div className="mt-8 animate-fade-in">
            <button className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              Explore Our Community
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;
