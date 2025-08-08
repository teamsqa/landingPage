'use client';

import { lazy, Suspense } from 'react';
import { Course } from '@/app/types/course';

// Lazy load del modal para reducir el bundle inicial
const CourseModal = lazy(() => import('./CourseModal'));

interface LazyModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalFallback = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function LazyModal({ course, isOpen, onClose }: LazyModalProps) {
  if (!course || !isOpen) return null;

  return (
    <Suspense fallback={<ModalFallback />}>
      <CourseModal course={course} isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}
