'use client';
import { useSidebar } from './SidebarContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: '📊'
  },
  {
    name: 'Usuarios',
    href: '/admin/usuarios',
    icon: '👥'
  },
  {
    name: 'Cursos',
    href: '/admin/cursos',
    icon: '📚'
  },
  {
    name: 'Inscripciones',
    href: '/admin/inscripciones',
    icon: '📝'
  },
  {
    name: 'Blog',
    href: '/admin/blog/view',
    icon: '✍️'
  },
  {
    name: 'Newsletter',
    href: '/admin/newsletter',
    icon: '📧'
  },
  {
    name: 'Config. Email',
    href: '/admin/email-setup',
    icon: '⚙️'
  }
];

export default function Sidebar() {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <aside 
      className={`
        fixed lg:static inset-y-0 left-0 z-20
        bg-gray-50 dark:bg-gray-800 border-r border-gray-200/80 dark:border-gray-700
        shadow-sm
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isCollapsed ? 'lg:translate-x-0' : 'lg:translate-x-0'}
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200/80 dark:border-gray-700 bg-gray-600 text-white">
          <div className={`font-bold text-xl ${isCollapsed ? 'hidden' : 'block'}`}>
            🚀 TeamsQA
          </div>
          <div className={`text-2xl ${isCollapsed ? 'block' : 'hidden'}`}>
            🚀
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-gray-200 dark:bg-blue-900/20 text-gray-800 dark:text-blue-400 border-r-2 border-gray-500 dark:border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:text-gray-800'
                  }
                `}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className={`${isCollapsed ? 'hidden' : 'block'} font-medium`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-gray-200/80 dark:border-gray-700 ${isCollapsed ? 'hidden' : 'block'}`}>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <div className="font-medium text-gray-700 dark:text-blue-400">Admin Panel</div>
              <div className="mt-1">v2.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}