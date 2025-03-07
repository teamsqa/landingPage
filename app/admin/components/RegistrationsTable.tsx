import { Table, Badge, Button, Card } from '@/app/ui';

type Registration = {
  _id: string;
  name: string;
  email: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

type Props = {
  registrations: Registration[];
  onUpdateStatus: (id: string, newStatus: 'approved' | 'rejected') => void;
  onRefresh: () => void;
};

export default function RegistrationsTable({ registrations, onUpdateStatus, onRefresh }: Props) {
  const columns = [
    { key: 'name', header: 'Nombre', width: 'w-1/4' },
    { key: 'email', header: 'Email', width: 'w-1/4' },
    { key: 'course', header: 'Curso', width: 'w-1/4' },
    { 
      key: 'status', 
      header: 'Estado',
      width: 'w-1/6',
      render: (value: string) => (
        <Badge
          variant={
            value === 'approved' ? 'success' :
            value === 'rejected' ? 'danger' :
            'warning'
          }
        >
          {
            value === 'approved' ? 'Aprobado' :
            value === 'rejected' ? 'Rechazado' :
            'Pendiente'
          }
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: 'w-1/6',
      render: (_: any, row: Registration) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onUpdateStatus(row._id, 'approved')}
            disabled={row.status === 'approved'}
          >
            Aprobar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onUpdateStatus(row._id, 'rejected')}
            disabled={row.status === 'rejected'}
          >
            Rechazar
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Inscripciones
          </h2>
          <Button
            variant="secondary"
            onClick={onRefresh}
          >
            Actualizar
          </Button>
        </div>
        
        <Table
          columns={columns}
          data={registrations}
          variant="striped"
        />
      </div>
    </Card>
  );
}