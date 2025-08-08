'use client';
import React, { useEffect, useState } from 'react';
import AdminLayout from "@/app/admin/components/AdminLayout";
import { Card, Button } from '@/app/ui';
import CoursesTable from '@/app/admin/components/CoursesTable';
import CourseFormModal from '@/app/admin/components/CourseFormModal';
import { Course } from '@/app/types/course';
import { showToast } from '@/app/components/Toast';
import { useConfirm } from '@/app/components/ConfirmModal';

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { confirm, ConfirmComponent } = useConfirm();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/courses');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar los cursos');
      }

      setCourses(data.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    const confirmed = await confirm({
      title: 'Eliminar Curso',
      message: '¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (!confirmed) {
      return;
    }

    const deletePromise = async () => {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar el curso');
      }

      setCourses(prev => prev.filter(course => course.id !== courseId));
      return data;
    };

    showToast.promise(
      deletePromise(),
      {
        loading: 'Eliminando curso...',
        success: '🗑️ Curso eliminado exitosamente',
        error: (err) => err.message || 'Error al eliminar el curso',
      }
    );
  };

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    const savePromise = async () => {
      const url = isEditing 
        ? `/api/admin/courses/${selectedCourse?.id}`
        : '/api/admin/courses';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar el curso');
      }

      // Actualizar el estado local
      if (isEditing) {
        setCourses(prev =>
          prev.map(course =>
            course.id === selectedCourse?.id ? data.data : course
          )
        );
      } else {
        setCourses(prev => [data.data, ...prev]);
      }

      setIsModalOpen(false);
      return data.data;
    };

    showToast.promise(
      savePromise(),
      {
        loading: isEditing ? 'Actualizando curso...' : 'Creando curso...',
        success: isEditing ? 'Curso actualizado exitosamente' : 'Curso creado exitosamente',
        error: (err) => err.message || 'Error al guardar el curso',
      }
    );
  };  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Cargando cursos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Card variant="elevated" className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button variant="primary" onClick={fetchCourses}>
            Reintentar
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Gestión de Cursos
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Administra los cursos que se muestran en la landing page
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleCreateCourse}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Curso
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card variant="elevated" className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Activos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.filter(c => c.active).length}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Inactivos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.filter(c => !c.active).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table Section */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lista de Cursos
          </h2>
          <Button
            variant="secondary"
            onClick={fetchCourses}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </Button>
        </div>
        
        <CoursesTable
          courses={courses}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
        />
      </Card>

      {/* Modal de Curso */}
      <CourseFormModal
        course={selectedCourse}
        isOpen={isModalOpen}
        isEditing={isEditing}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
      />
      
      {/* Modal de Confirmación */}
      <ConfirmComponent />
    </AdminLayout>
  );
};

export default CoursesPage;
