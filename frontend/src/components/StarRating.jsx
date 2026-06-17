import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

/**
 * StarRating component.
 */
const StarRating = ({ rating = 0, onRate, readonly = false, size = 20 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1 select-none">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hover || rating);
        return (
          <motion.button
            key={star}
            type="button"
            disabled={readonly}
            whileHover={readonly ? {} : { scale: 1.25, rotate: 12 }}
            whileTap={readonly ? {} : { scale: 0.9 }}
            className={`transition-colors duration-200 outline-none ${
              readonly ? 'cursor-default' : 'cursor-pointer'
            } ${
              isFilled ? 'text-amber-500' : 'text-slate-700 hover:text-slate-500'
            }`}
            onClick={() => !readonly && onRate && onRate(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
          >
            <Star
              size={size}
              fill={isFilled ? 'currentColor' : 'transparent'}
              strokeWidth={2}
            />
          </motion.button>
        );
      })}
    </div>
  );
};

export default StarRating;
