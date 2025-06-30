
const Hero = () => {
  return (
    <div className="relative h-[500px] bg-gradient-to-r from-[#186F65] via-[#186F65]/90 to-[#B2533E] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            Al Ameen Mission Academy
          </h1>
          <h2 className="text-xl md:text-3xl font-medium mb-4 text-[#F9F7F1]">
            Alumni Association - Midnapore Branch
          </h2>
          <p className="text-base md:text-lg opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connecting generations of learners, fostering brotherhood, and preserving our mission's legacy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#186F65] px-8 py-3 rounded-full font-semibold hover:bg-[#F9F7F1] transition-all duration-300 shadow-lg">
              Join Our Community
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#186F65] transition-all duration-300">
              Explore Alumni Network
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F9F7F1] to-transparent"></div>
    </div>
  );
};

export default Hero;
