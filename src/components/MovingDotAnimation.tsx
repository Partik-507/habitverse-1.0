import React from 'react';

export const MovingDotAnimation = () => {
  return (
    <div className="relative w-full h-6 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700 overflow-visible flex items-center">
      <div className="absolute top-1/2 left-0 w-full h-3 pointer-events-none">
        <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg animate-pulse"
             style={{ top: '-0.5rem' }}>
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce-slow"></div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateX(0) scale(1); }
          20% { transform: translateX(20vw) scale(1.15);}
          50% { transform: translateX(45vw) scale(1.1);}
          80% { transform: translateX(90vw) scale(1.15);}
          100% { transform: translateX(0) scale(1);}
        }
        .animate-bounce-slow {
          animation: bounce-slow 8s ease-in-out infinite;
        }
        `
      }} />
    </div>
  );
};
