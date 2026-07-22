import { cn } from '@/lib/utils';

interface PointsBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Displays a POKIP Points amount with the silver-ring "P" mark. */
export const PointsBadge = ({ points, size = 'md', className }: PointsBadgeProps) => {
  const sizes = {
    sm: 'text-sm gap-1.5 px-2 py-0.5',
    md: 'text-base gap-2 px-2.5 py-1',
    lg: 'text-lg gap-2.5 px-3 py-1.5',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-pokip-blue-soft text-pokip-blue-deep font-semibold ring-1 ring-inset ring-pokip-blue/20',
        sizes[size],
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-silver ring-1 ring-pokip-silver text-[10px] font-bold text-pokip-blue"
      >
        P
      </span>
      {points.toLocaleString()} pts
    </span>
  );
};