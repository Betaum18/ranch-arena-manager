import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Início', to: '/' },
  { label: 'Sobre', to: '/#sobre' },
  { label: 'Campeonatos', to: '/#campeonatos' },
  { label: 'Contato', to: '/#contato' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-darker/95 backdrop-blur-sm border-b border-sidebar-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-heading text-xl font-bold tracking-wider text-primary-foreground">
          <span className="text-primary">Ranch</span>{' '}
          <span className="text-gold">Sorting</span>{' '}
          <span className="text-sidebar-foreground text-sm font-body font-normal">ABQM</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sidebar-foreground/80 hover:text-gold transition-colors text-sm font-medium">
              {l.label}
            </Link>
          ))}
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/login">Entrar</Link>
          </Button>
        </div>

        <button className="md:hidden text-sidebar-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-surface-darker border-t border-sidebar-border px-4 pb-4 space-y-3">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="block text-sidebar-foreground/80 hover:text-gold py-1" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/login" onClick={() => setOpen(false)}>Entrar</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
