'use client';
import React from 'react';
import { Table, Badge, Button } from '@/app/ui';
import { Course } from '@/app/types/course';
import SafeImage from '@/app/components/SafeImage';

interface CoursesTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const CoursesTable: React.FC<CoursesTableProps> = ({ courses, onEdit, onDelete }) => {
  // Validar y limpiar los datos de cursos
  const validCourses = React.useMemo(() => {
    if (!Array.isArray(courses)) {
      console.warn('CoursesTable: courses prop is not an array:', courses);
      return [];
    }
    
    return courses.filter((course) => {
      if (!course || typeof course !== 'object') {
        console.warn('CoursesTable: Invalid course object:', course);
        return false;
      }
      
      if (!course.id) {
        console.warn('CoursesTable: Course missing id:', course);
        return false;
      }
      
      return true;
    });
  }, [courses]);

  // Componente para vista de tarjeta móvil
  const CourseCard = ({ course }: { course: Course }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <SafeImage
          className="h-16 w-20 object-cover rounded-lg flex-shrink-0"
          src={course.image}
          alt={course.title || 'Course image'}
          fallbackSrc="/aws.svg"
          onErrorLogged={(error) => console.debug('Course image error:', error)}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {course.title || 'Sin título'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
            {course.description || 'Sin descripción'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Nivel:</span>
          <div className="mt-1">
            <Badge variant={
              course.level === 'Básico' ? 'success' : 
              course.level === 'Intermedio' ? 'warning' : 
              course.level === 'Avanzado' ? 'danger' : 'default'
            }>
              {course.level}
            </Badge>
          </div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Estado:</span>
          <div className="mt-1">
            <Badge variant={course.active !== false ? 'success' : 'default'}>
              {course.active !== false ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Duración:</span>
          <p className="text-gray-900 dark:text-white mt-1">
            {course.duration || 'No especificado'}
          </p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Precio:</span>
          <p className="font-medium text-gray-900 dark:text-white mt-1">
            {course.price || 'Gratis'}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SafeImage
              className="h-6 w-6 rounded-full"
              src={course.instructorImage}
              alt={course.instructor || 'Instructor'}
              fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor || 'Instructor')}&background=10b981&color=ffffff&size=24`}
              onErrorLogged={(error) => console.debug('Instructor image error:', error)}
            />
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">
                {course.instructor || 'Sin instructor'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(course)}
              className="text-xs px-2 py-1"
            >
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => course.id && onDelete(course.id)}
              className="text-xs px-2 py-1"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  const columns = [
    {
      key: 'image',
      header: 'Imagen',
      width: 'w-16',
      render: (_: any, row: Course) => (
        <div className="flex-shrink-0">
          <SafeImage
            className="h-12 w-16 object-cover rounded-lg"
            src={row.image}
            alt={row.title || 'Course image'}
            fallbackSrc="/aws.svg"
            onErrorLogged={(error) => console.debug('Course image error:', error)}
          />
        </div>
      )
    },
    {
      key: 'title',
      header: 'Título',
      render: (_: any, row: Course) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {row.title || 'Sin título'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
            {row.description || 'Sin descripción'}
          </div>
        </div>
      )
    },
    {
      key: 'level',
      header: 'Nivel',
      render: (_: any, row: Course) => {
        const levelColors = {
          'Básico': 'success',
          'Intermedio': 'warning',
          'Avanzado': 'danger'
        } as const;
        
        return (
          <Badge variant={levelColors[row.level as keyof typeof levelColors] || 'default'}>
            {row.level}
          </Badge>
        );
      }
    },
    {
      key: 'duration',
      header: 'Duración',
      render: (_: any, row: Course) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {row.duration || 'No especificado'}
        </span>
      )
    },
    {
      key: 'price',
      header: 'Precio',
      render: (_: any, row: Course) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {row.price || 'Gratis'}
        </span>
      )
    },
    {
      key: 'instructor',
      header: 'Instructor',
      render: (_: any, row: Course) => {
        const getAvatarUrl = (instructor: string) => {
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor || 'Instructor')}&background=10b981&color=ffffff&size=32`;
        };

        return (
          <div className="flex items-center">
            <SafeImage
              className="h-8 w-8 rounded-full mr-3"
              src={row.instructorImage}
              alt={row.instructor || 'Instructor'}
              fallbackSrc={getAvatarUrl(row.instructor || 'Instructor')}
              onErrorLogged={(error) => console.debug('Instructor image error:', error)}
            />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {row.instructor || 'Sin instructor'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {row.instructorRole || 'Instructor'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'active',
      header: 'Estado',
      render: (_: any, row: Course) => (
        <Badge variant={row.active !== false ? 'success' : 'default'}>
          {row.active !== false ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_: any, row: Course) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => row && onEdit(row)}
            className="text-xs px-2 py-1"
            disabled={!row}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => row?.id && onDelete(row.id)}
            className="text-xs px-2 py-1"
            disabled={!row?.id}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  if (validCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay cursos disponibles
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Crea tu primer curso para comenzar.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vista móvil - tarjetas */}
      <div className="block lg:hidden space-y-4">
        {validCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Vista desktop - tabla */}
      <div className="hidden lg:block">
        <Table
          columns={columns}
          data={validCourses}
          variant="striped"
        />
      </div>
    </>
  );
};

export default CoursesTable;