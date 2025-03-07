import { useState } from 'react';
import { Button, Input, Card } from '@/app/ui';

type Course = {
  id?: string;
  name: string;
  description: string;
  instructor: string;
};

type CourseFormProps = {
  initialData?: Course;
  onSubmit: (course: Course) => void;
  onCancel: () => void;
};

export default function CourseForm({ initialData, onSubmit, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState<Course>(initialData || {
    name: '',
    description: '',
    instructor: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card variant="elevated" className="p-6">
      <h2 className="text-2xl font-bold mb-4">{initialData ? 'Editar Curso' : 'Agregar Curso'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <Input
          label="Instructor"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          required
        />
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" variant="primary">Guardar</Button>
        </div>
      </form>
    </Card>
  );
}