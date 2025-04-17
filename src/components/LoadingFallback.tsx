import { Skeleton, SkeletonCard, SkeletonText } from './Skeleton';

interface LoadingFallbackProps {
  type?: 'default' | 'page' | 'card' | 'list' | 'table';
  count?: number;
  columns?: number;
}

function LoadingFallback({ type = 'default', count = 3, columns = 3 }: LoadingFallbackProps) {
  if (type === 'default') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (type === 'page') {
    return (
      <div className="space-y-8 py-6">
        {/* Hero Section Skeleton */}
        <div className="w-full">
          <Skeleton height="300px" className="w-full mb-8" />
          <div className="container mx-auto px-4">
            <Skeleton height="2.5rem" width="50%" className="mb-4" />
            <SkeletonText lines={3} lineHeight="1rem" width="100%" className="mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4">
                  <Skeleton height="100px" className="mb-4" />
                  <Skeleton height="1.5rem" width="70%" className="mb-2" />
                  <SkeletonText lines={2} lineHeight="0.75rem" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4 py-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-start p-4 border rounded-lg">
            <Skeleton width="80px" height="80px" circle className="mr-4" />
            <div className="flex-1">
              <Skeleton height="1.5rem" width="70%" className="mb-2" />
              <SkeletonText lines={2} lineHeight="0.75rem" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="p-4 bg-white rounded-lg shadow my-6">
        <Skeleton height="2rem" width="30%" className="mb-4" />
        <div className="overflow-x-auto">
          <div className="w-full">
            {/* Tablo başlığı */}
            <div className="flex border-b pb-2 mb-2">
              {Array.from({ length: columns }).map((_, i) => (
                <div key={i} className="flex-1 px-2">
                  <Skeleton height="1.5rem" width="80%" />
                </div>
              ))}
            </div>
            
            {/* Tablo gövdesi */}
            {Array.from({ length: count }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex py-3 border-b">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div key={colIndex} className="flex-1 px-2">
                    <Skeleton height="1rem" width={colIndex === 0 ? '60%' : '80%'} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default LoadingFallback; 