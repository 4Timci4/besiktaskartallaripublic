import React from 'react';

interface LoadingSpinnerProps {
  size?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = '6' }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div 
        data-testid="loading-spinner"
        className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-besiktas-red`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;