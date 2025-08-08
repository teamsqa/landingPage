import LoadingWithLogo from '@/app/components/LoadingWithLogo';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-lime-200 dark:bg-lime-900 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="relative">
        <LoadingWithLogo 
          message="Procesando inscripción..." 
          size="lg"
        />
      </div>
    </div>
  );
}