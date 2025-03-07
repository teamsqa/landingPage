'use client';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import CourseModal from '@/app/components/CourseModal';
import { Course } from '@/app/types/course';
import { courses } from '@/app/data/courses';


interface CourseDetailsPageProps {
  params: { courseId: string };
}

export default function CourseDetailsPage({ params }: CourseDetailsPageProps) {
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