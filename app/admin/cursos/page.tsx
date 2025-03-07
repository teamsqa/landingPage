'use client';

import { useState } from 'react';
import AdminLayout from '@/app/admin/components/AdminLayout';
import CoursesTable from '@/app/admin/components/CoursesTable';
import CourseForm from '@/app/admin/components/CourseForm';
import { Button } from '@/app/ui';

type Course = {
  id: string;
  name: string;
  description: string;
  instructor: string;
};

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsFormVisible(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsFormVisible(true);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const handleFormSubmit = (course: Course) => {
    if (editingCourse) {
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? course : c))
      );
    } else {
      setCourses((prev) => [...prev, { ...course, id: Date.now().toString() }]);
    }
    setIsFormVisible(false);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Administración de Cursos
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gestiona los cursos disponibles en la plataforma.
        </p>
      </div>
      {isFormVisible ? (
        <CourseForm
          initialData={editingCourse}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          <Button variant="primary" onClick={handleAddCourse} className="mb-4">
            Agregar Curso
          </Button>
          <CoursesTable
            courses={courses}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
        </>
      )}
    </AdminLayout>
  );
}