import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  showCount?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating = 4.5, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars || (i === fullStars && hasHalf)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs font-bold text-amber-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
