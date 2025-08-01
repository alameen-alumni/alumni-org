import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-auto md:h-[600px] overflow-hidden">
      {/* Mobile: Image on top, text below */}
      <div className="block md:hidden w-full px-2">
        <img
          src="/msn2.png"
          alt="Hero background"
          className="w-full h-48 object-cover rounded-lg shadow-md mt-2"
        />
        <div className="text-center text-gray-800 px-4 max-w-2xl mx-auto pt-8 pb-12">
          <h1 className="text-2xl font-serif font-bold mb-3 leading-tight">
            Alumni Association Midnapore
          </h1>
          <p className="text-xs font-medium mb-8 max-w-xl mx-auto leading-relaxed">
            Alumni of Al Ameen Mission Academy, Midnapore
          </p>
          <div className="flex flex-col gap-4 items-center">
            <button className="bg-[#186F65] text-white px-6 py-3 text-sm rounded-full font-medium hover:bg-[#F9F7F1] hover:text-[#186F65] transition-all duration-300 shadow-lg">
              Register For Reunion 2025
            </button>
            {/* <button onClick={() => navigate('/alumni')} className="border-2 border-[#186F65] text-[#186F65] px-5 py-2 rounded-full font-medium hover:bg-[#186F65] hover:text-white transition-all duration-300">
              Explore Alumni Network
            </button> */}
          </div>
        </div>
      </div>

      {/* Desktop: Overlay style */}
      <div className="hidden md:block relative h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-52"
          style={{
            backgroundImage: `url('/msn2.png')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60 opacity-36" />
        <div className="relative z-10 flex items-center justify-center h-full pt-24">
          <div className="text-center text-white px-4 max-w-4xl shadow-2xl">
            <h1 className="text-6xl font-serif font-bold mb-4 leading-tight">
              Alumni Association Midnapore
            </h1>

            <p className="text-xl font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
              Alumni of Al Ameen Mission Academy, Midnapore
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <button onClick={() => navigate('/reunion2k25')} className="bg-white text-[#186F65] px-8  py-3 rounded-full font-semibold hover:bg-[#F9F7F1] transition-all duration-300 shadow-lg">
                Register For Reunion 2025
              </button>
              {/* <button onClick={() => navigate('/alumni')} className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#186F65] transition-all duration-300">
                Explore Alumni Network
              </button> */}
            </div>
          </div>
        </div>
        {/* <div className="absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-[#F9F7F1] to-transparent"></div> */}
      </div>
    </div>
  );
};

export default Hero;
