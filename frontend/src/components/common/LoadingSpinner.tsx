import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading verified tourism data...',
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
        <Loader2 className={`absolute inset-0 m-auto text-orange-400 ${iconSize} animate-pulse`} />
      </div>
      {message && (
        <p className="text-sm font-medium text-charcoal-light animate-pulse text-center">
          {message}
        </p>
      )}
    </div>
  );
};
