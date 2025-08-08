import { Table, Badge, Button, Card } from '@/app/ui';

type Registration = {
  _id: string;
  name: string;
  email: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  phone?: string;
  country?: string;
  department?: string;
  municipality?: string;
  city?: string;
  education?: string;
  institution?: string;
  programming_experience?: string;
  company?: string;
  position?: string;
  motivation?: string;
  tools?: string[];
};

type Props = {
  registrations: Registration[];
  onUpdateStatus: (id: string, newStatus: 'approved' | 'rejected') => void;
  onRefresh: () => void;
  onViewDetail: (registration: Registration) => void;
};

export default function RegistrationsTable({ registrations, onUpdateStatus, onRefresh, onViewDetail }: Props) {
  // Componente para vista de tarjeta móvil
  const RegistrationCard = ({ registration }: { registration: Registration }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/60 dark:border-gray-700/60 rounded-xl p-5 space-y-4 shadow-lg shadow-gray-900/5 dark:shadow-black/10 hover:shadow-xl hover:shadow-gray-900/10 dark:hover:shadow-black/20 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {registration.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                {registration.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {registration.email}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg px-3 py-2 border border-blue-200/30 dark:border-blue-800/30">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              📚 {registration.course}
            </p>
          </div>
        </div>
        
        <Badge
          variant={
            registration.status === 'approved' ? 'success' :
            registration.status === 'rejected' ? 'danger' :
            'warning'
          }
          className="shadow-md"
        >
          {
            registration.status === 'approved' ? '✓ Aprobado' :
            registration.status === 'rejected' ? '✗ Rechazado' :
            '⏳ Pendiente'
          }
        </Badge>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 rounded-lg px-3 py-2 font-medium">
        🕒 {new Date(registration.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
      
      <div className="border-t border-gray-200/60 dark:border-gray-700/60 pt-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetail(registration)}
            className="text-xs px-3 py-2 flex-1 sm:flex-none font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            👁️ Ver Detalle
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onUpdateStatus(registration._id, 'approved')}
            disabled={registration.status === 'approved'}
            className="text-xs px-3 py-2 flex-1 sm:flex-none font-medium shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          >
            ✓ Aprobar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onUpdateStatus(registration._id, 'rejected')}
            disabled={registration.status === 'rejected'}
            className="text-xs px-3 py-2 flex-1 sm:flex-none font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            ✗ Rechazar
          </Button>
        </div>
      </div>
    </div>
  );
  const columns = [
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { key: 'course', header: 'Curso' },
    { 
      key: 'status', 
      header: 'Estado',
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
      render: (_: any, row: Registration) => (
        <div className="flex flex-wrap gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetail(row)}
            className="text-xs px-2 py-1"
          >
            Ver Detalle
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onUpdateStatus(row._id, 'approved')}
            disabled={row.status === 'approved'}
            className="text-xs px-2 py-1"
          >
            Aprobar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onUpdateStatus(row._id, 'rejected')}
            disabled={row.status === 'rejected'}
            className="text-xs px-2 py-1"
          >
            Rechazar
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card variant="elevated" className="overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-gray-900/5 dark:shadow-black/10">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Inscripciones
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Gestiona las solicitudes de inscripción
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={onRefresh}
            className="w-full sm:w-auto bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
          >
            🔄 Actualizar
          </Button>
        </div>
        
        {/* Vista móvil - tarjetas */}
        <div className="block lg:hidden space-y-4">
          {registrations.length > 0 ? (
            registrations.map((registration) => (
              <RegistrationCard key={registration._id} registration={registration} />
            ))
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No hay inscripciones
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Las nuevas inscripciones aparecerán aquí
              </p>
            </div>
          )}
        </div>

        {/* Vista desktop - tabla */}
        <div className="hidden lg:block overflow-x-auto bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
          {registrations.length > 0 ? (
            <Table
              columns={columns}
              data={registrations}
              variant="striped"
            />
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
                No hay inscripciones
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Las nuevas inscripciones aparecerán aquí
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}