import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, Upload, User, LogOut, Menu, Users, ClipboardList } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const baseLinks = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, adminOnly: false },
  { label: 'Campeonatos', to: '/dashboard/campeonatos', icon: Trophy, adminOnly: false },
  { label: 'Upload Inscrições', to: '/dashboard/upload', icon: Upload, adminOnly: false },
  { label: 'Inscrições', to: '/dashboard/inscricoes', icon: ClipboardList, adminOnly: false },
  { label: 'Usuários', to: '/dashboard/usuarios', icon: Users, adminOnly: true },
  { label: 'Meu Perfil', to: '/dashboard/perfil', icon: User, adminOnly: false },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = baseLinks.filter((l) => !l.adminOnly || user?.role === 'admin');

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface-darker border-r border-sidebar-border transform transition-transform md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Link to="/" className="font-heading text-lg font-bold">
            <span className="text-primary">Ranch</span> <span className="text-gold">Sorting</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active ? 'bg-primary/20 text-primary' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={() => logout()} className="flex items-center gap-2 text-sidebar-foreground/50 hover:text-destructive text-sm w-full px-3 py-2">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-surface-darker/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6">
          <button className="md:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Olá, <strong className="text-foreground">{user?.name}</strong></span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
