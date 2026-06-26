import { cn, getInitials } from '../../utils/helpers';

const COLORS = [
  'bg-primary-500', 'bg-secondary-700', 'bg-green-500',
  'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500',
];

const getColor = (name = '') => {
  const idx = name.charCodeAt(0) % COLORS.length;
  return COLORS[idx];
};

const Avatar = ({ name, size = 'md', className = '', src }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover flex-shrink-0', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0',
        sizes[size],
        getColor(name),
        className
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
