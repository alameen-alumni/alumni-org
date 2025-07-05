import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-[600px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-52"
        style={{
          backgroundImage: `url('/msn2.png')`
        }}
      ></div>
      
      <div className="absolute inset-0 bg-black/60 opacity-36" />
      
      <div className="relative z-10 flex items-center justify-center h-full pt-24">
        <div className="text-center text-white px-4 max-w-4xl shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            Al Ameen Mission Academy
          </h1>
          <h2 className="text-xl md:text-3xl font-medium mb-4 text-[#F9F7F1]">
            Alumni Association - Midnapore Branch
          </h2>
          <p className="text-base md:text-lg font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
            Connecting generations of learners, fostering brotherhood, and preserving our mission's legacy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#186F65] px-8 py-3 rounded-full font-semibold hover:bg-[#F9F7F1] transition-all duration-300 shadow-lg">
              Join Our Community
            </button>
            <button onClick={() => navigate('/alumni')} className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#186F65] transition-all duration-300">
              Explore Alumni Network
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-[#F9F7F1] to-transparent"></div>
    </div>
  );
};

export default Hero;
