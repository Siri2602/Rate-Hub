import { cn } from '../../utils/helpers';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { icon: 28, text: 'text-base' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-3xl' },
  };

  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Store building */}
        <rect x="5" y="17" width="30" height="18" rx="2.5" fill="#2563EB" />
        {/* Roof with R hint */}
        <path d="M3 17 L20 5 L37 17 Z" fill="#1D4ED8" />
        {/* Subtle R in roof */}
        <path
          d="M17 10 L17 15 M17 10 L20.5 10 Q22.5 10 22.5 12 Q22.5 14 20.5 14 L17 14 M20.5 14 L23 15"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        {/* Door */}
        <rect x="16" y="25" width="8" height="10" rx="1.5" fill="#BFDBFE" />
        {/* Windows */}
        <rect x="7" y="21" width="7" height="5" rx="1.5" fill="#BFDBFE" />
        <rect x="26" y="21" width="7" height="5" rx="1.5" fill="#BFDBFE" />
        {/* Gold star above */}
        <path
          d="M20 1 L21.5 5.5 L26.5 5.5 L22.5 8.5 L24 13 L20 10 L16 13 L17.5 8.5 L13.5 5.5 L18.5 5.5 Z"
          fill="#FBBF24"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-display font-bold text-gray-900 dark:text-white tracking-tight', text)}>
            Rate<span className="text-primary-600">Hub</span>
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-gray-400 dark:text-dark-muted font-medium tracking-wider">
              DISCOVER · RATE · IMPROVE
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
