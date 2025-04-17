import { cn } from '../utils/cn';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  circle?: boolean;
  animate?: boolean;
}

export function Skeleton({
  className,
  width,
  height,
  rounded = true,
  circle = false,
  animate = true,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200',
        {
          'animate-pulse': animate,
          'rounded-md': rounded && !circle,
          'rounded-full': circle,
        },
        className
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  lineHeight?: string | number;
  width?: string | number | (string | number)[];
  className?: string;
  gap?: string | number;
}

export function SkeletonText({
  lines = 3,
  lineHeight = '1rem',
  width = '100%',
  className,
  gap = '0.5rem',
}: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col', className)} style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => {
        // Eğer width bir dizi ise, her satır için farklı genişlik kullan
        const lineWidth = Array.isArray(width) ? width[i % width.length] : width;
        return (
          <Skeleton
            key={i}
            className="w-full"
            width={lineWidth}
            height={lineHeight}
          />
        );
      })}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
  imageHeight?: string | number;
  lines?: number;
}

export function SkeletonCard({ className, imageHeight = '200px', lines = 3 }: SkeletonCardProps) {
  return (
    <div className={cn('rounded-lg overflow-hidden shadow-md', className)}>
      <Skeleton height={imageHeight} rounded={false} />
      <div className="p-4">
        <Skeleton className="mb-2" height="1.5rem" width="70%" />
        <SkeletonText lines={lines} lineHeight="0.75rem" width={['100%', '90%', '80%']} />
      </div>
    </div>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Tablo başlığı */}
      <div className="flex border-b pb-2 mb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 px-2">
            <Skeleton height="1.5rem" width="80%" />
          </div>
        ))}
      </div>
      
      {/* Tablo gövdesi */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex py-2 border-b">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 px-2">
              <Skeleton height="1rem" width={colIndex === 0 ? '60%' : '80%'} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Birleştirilmiş şekilde dışa aktarma
export default {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
};
