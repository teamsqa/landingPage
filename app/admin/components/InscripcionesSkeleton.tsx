'use client';

import { Card } from '@/app/ui';

interface InscripcionesSkeletonProps {
  showStats?: boolean;
  showTable?: boolean;
}

const StatCardSkeleton = () => (
  <Card variant="elevated" className="p-6 relative overflow-hidden">
    {/* Shimmer overlay */}
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent"></div>
    
    <div className="flex items-center animate-pulse">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="ml-4 flex-1">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
      </div>
    </div>
  </Card>
);

const TableRowSkeleton = () => (
  <div className="border-b border-gray-200 dark:border-gray-600 last:border-b-0">
    <div className="px-6 py-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Nombre */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>

        {/* Curso */}
        <div className="flex items-center">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
        </div>

        {/* Estado */}
        <div className="flex items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
        </div>

        {/* Fecha */}
        <div className="flex items-center">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
);

const TableHeaderSkeleton = () => (
  <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
    <div className="px-6 py-3 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-14"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export default function InscripcionesSkeleton({ 
  showStats = true, 
  showTable = true 
}: InscripcionesSkeletonProps) {
  return (
    <>
      {/* Header Skeleton */}
      <div className="mb-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>

      {/* Statistics Cards Skeleton */}
      {showStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      )}

      {/* Table Section Skeleton */}
      {showTable && (
        <Card variant="elevated" className="p-6 relative overflow-hidden">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent"></div>
          
          {/* Table Header */}
          <div className="flex items-center justify-between mb-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
            <TableHeaderSkeleton />
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {[...Array(8)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-6 flex items-center justify-between animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </Card>
      )}

      {/* Shimmer Effect Styles */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

export { InscripcionesSkeleton };
