import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  loadingTime?: number;
}

const LoadingScreen = ({ onLoadingComplete, loadingTime = 2000 }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after a brief delay
    const showTimer = setTimeout(() => setShowContent(true), 100);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500); // Small delay before hiding
          return 100;
        }
        return prev + 2;
      });
    }, loadingTime / 50); // 50 steps to reach 100%

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, [onLoadingComplete, loadingTime]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50">
      <div className="text-center">
        {/* Logo Animation */}
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="relative mb-8">
            {/* Logo Container */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-600 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <img 
                src="/logo.jpg" 
                alt="Alumni Organization Logo" 
                className="w-16 h-16 rounded-full object-cover border-4 border-white"
              />
            </div>
            
            {/* Animated Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 border-r-emerald-500 animate-spin"></div>
          </div>
        </div>

        {/* App Name */}
        <div className={`transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Alumni Organization
          </h1>
          <p className="text-gray-600 text-lg">
            Connecting Alumni Worldwide
          </p>
        </div>

        {/* Loading Spinner */}
        <div className={`transition-all duration-1000 delay-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mt-8 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mr-3" />
            <span className="text-gray-600 font-medium">Loading...</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`transition-all duration-1000 delay-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mt-6 w-64 mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{progress}% Complete</p>
          </div>
        </div>

        {/* Loading Messages */}
        <div className={`transition-all duration-1000 delay-900 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mt-6 text-sm text-gray-500">
            {progress < 30 && "Initializing..."}
            {progress >= 30 && progress < 60 && "Loading gallery..."}
            {progress >= 60 && progress < 90 && "Preparing dashboard..."}
            {progress >= 90 && "Almost ready..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 