import { cn } from '../../utils/helpers';

const Skeleton = ({ className = '', width, height, rounded = 'md' }) => {
  const roundedMap = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn('shimmer', roundedMap[rounded], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

export const CardSkeleton = () => (
  <div className="card p-5 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton width={48} height={48} rounded="full" />
      <div className="flex-1 space-y-2">
        <Skeleton height={16} rounded="lg" className="w-2/3" />
        <Skeleton height={12} rounded="lg" className="w-1/2" />
      </div>
    </div>
    <Skeleton height={12} rounded="lg" />
    <Skeleton height={12} rounded="lg" className="w-4/5" />
    <div className="flex gap-2">
      <Skeleton height={32} rounded="lg" className="w-24" />
      <Skeleton height={32} rounded="lg" className="w-20" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex items-center gap-4 p-3">
        <Skeleton width={36} height={36} rounded="full" />
        <Skeleton height={14} className="flex-1" rounded="lg" />
        <Skeleton height={14} width={100} rounded="lg" />
        <Skeleton height={14} width={80} rounded="lg" />
        <Skeleton height={28} width={60} rounded="lg" />
      </div>
    ))}
  </div>
);

export const StatCardSkeleton = () => (
  <div className="card p-5 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton height={14} width={100} rounded="lg" />
      <Skeleton width={40} height={40} rounded="xl" />
    </div>
    <Skeleton height={32} width={80} rounded="lg" />
    <Skeleton height={12} width={120} rounded="lg" />
  </div>
);

export default Skeleton;
