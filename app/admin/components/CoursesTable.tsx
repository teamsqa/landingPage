import { useState } from 'react';
import { Button, Card } from '@/app/ui';

type Course = {
  id: string;
  name: string;
  description: string;
  instructor: string;
};

type CoursesTableProps = {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
};

export default function CoursesTable({ courses, onEdit, onDelete }: CoursesTableProps) {
  return (
    <Card variant="elevated" className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cursos</h2>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Descripción</th>
            <th className="py-2 px-4 border-b">Instructor</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="py-2 px-4 border-b">{course.name}</td>
              <td className="py-2 px-4 border-b">{course.description}</td>
              <td className="py-2 px-4 border-b">{course.instructor}</td>
              <td className="py-2 px-4 border-b">
                <Button variant="secondary" onClick={() => onEdit(course)}>Editar</Button>
                <Button variant="danger" onClick={() => onDelete(course.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}