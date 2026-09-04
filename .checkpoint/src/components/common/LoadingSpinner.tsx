import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading heritage data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      <p className="text-xs text-charcoal-light font-medium tracking-wide">{message}</p>
    </div>
  );
};
