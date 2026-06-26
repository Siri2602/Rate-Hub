import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

const useCounter = (end, duration = 1500) => {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);

  useEffect(() => {
    if (end === undefined || end === null) return;
    startTime.current = null;

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [end, duration]);

  return count;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary-600',
  iconBg = 'bg-primary-50 dark:bg-primary-900/20',
  change,
  changeLabel,
  suffix = '',
  prefix = '',
  isFloat = false,
  delay = 0,
  className = '',
}) => {
  const numericValue = isFloat
    ? parseFloat(value || 0)
    : parseInt(value || 0, 10);
  const counted = useCounter(isFloat ? 0 : numericValue);

  const displayValue = isFloat
    ? (numericValue || 0).toFixed(1)
    : counted.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn('card-hover p-5', className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">{title}</p>
          <p className="mt-2 text-2xl font-display font-bold text-gray-900 dark:text-dark-text">
            {prefix}{displayValue}{suffix}
          </p>
          {(change !== undefined || changeLabel) && (
            <div className="mt-1 flex items-center gap-1">
              {change !== undefined && (
                <>
                  {change >= 0 ? (
                    <TrendingUp size={13} className="text-green-500" />
                  ) : (
                    <TrendingDown size={13} className="text-red-500" />
                  )}
                  <span className={cn(
                    'text-xs font-medium',
                    change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  )}>
                    {change >= 0 ? '+' : ''}{change}%
                  </span>
                </>
              )}
              {changeLabel && (
                <span className="text-xs text-gray-400 dark:text-dark-muted ml-1">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('p-2.5 rounded-xl flex-shrink-0', iconBg)}>
            <Icon size={22} className={iconColor} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
