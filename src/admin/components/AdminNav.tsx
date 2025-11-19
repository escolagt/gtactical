import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AdminNav = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Inscrições', href: '/admin/leads', icon: Users },
    { label: 'Cursos', href: '/admin/courses', icon: BookOpen },
    { label: 'Configurações', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="glass rounded-xl p-6 mb-8">
      <Link
        to="/"
        className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors mb-6 pb-6 border-b border-white/10"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o site
      </Link>
      
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-foreground/70 hover:bg-white/[0.02] hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
