import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen fixed">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <nav className="space-y-4">
          <Link href="/admin" className="block py-2 px-4 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/admin/inscripciones" className="block py-2 px-4 rounded hover:bg-gray-700">
            Inscripciones
          </Link>
          <Link href="/admin/cursos" className="block py-2 px-4 rounded hover:bg-gray-700">
            Cursos
          </Link>
          <Link href="/admin/usuarios" className="block py-2 px-4 rounded hover:bg-gray-700">
            Usuarios
          </Link>
        </nav>
      </div>
    </aside>
  );
}