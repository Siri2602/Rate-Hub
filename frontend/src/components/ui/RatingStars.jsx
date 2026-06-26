import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const StarIcon = ({ filled, half, size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {half && (
        <linearGradient id={`half-${size}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      )}
    </defs>
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={half ? `url(#half-${size})` : filled ? '#FBBF24' : 'transparent'}
      stroke={filled || half ? '#FBBF24' : '#d1d5db'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Display-only stars
export const StarDisplay = ({ rating = 0, total = 5, size = 16, showValue = false }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <StarIcon key={i} filled={filled} half={half} size={size} />
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-dark-muted">
          {rating > 0 ? Number(rating).toFixed(1) : 'N/A'}
        </span>
      )}
    </div>
  );
};

// Interactive rating stars
const RatingStars = ({ value = 0, onChange, size = 28, readOnly = false }) => {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      className={cn('flex items-center gap-1', !readOnly && 'cursor-pointer')}
      role={!readOnly ? 'group' : undefined}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          className={cn('rating-star focus:outline-none', readOnly && 'pointer-events-none')}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          whileHover={!readOnly ? { scale: 1.2 } : {}}
          whileTap={!readOnly ? { scale: 0.9 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <motion.div
            animate={{
              scale: display >= star ? 1 : 0.85,
              rotateY: display >= star ? 0 : 0,
            }}
            transition={{ duration: 0.25, delay: (star - 1) * 0.04 }}
          >
            <StarIcon
              filled={display >= star}
              size={size}
              className={cn(
                'transition-all duration-200',
                display >= star ? 'drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]' : ''
              )}
            />
          </motion.div>
        </motion.button>
      ))}
    </div>
  );
};

export default RatingStars;
