'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Course } from '@/app/types/course';
import { courses } from '@/app/data/courses';
import CourseModal from '@/app/components/CourseModal';

export default function CourseDetailsPage({ 
  params 
}: { 
  params: { courseId: string } 
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === params.courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      notFound();
    }
  }, [params.courseId]);

  if (!course) {
    return null;
  }

  return (
    <CourseModal
      course={course}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  );
}