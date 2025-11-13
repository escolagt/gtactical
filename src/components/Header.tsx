import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Cursos', href: 'cursos' },
    { label: 'Sobre', href: 'sobre' },
    { label: 'Inscrição', href: 'inscricao' },
    { label: 'Contato', href: 'contato' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'h-12 bg-black/80 backdrop-blur-md border-b border-white/10'
          : 'h-16 bg-black/70 backdrop-blur-sm'
      )}
    >
      <nav
        className="container mx-auto h-full flex items-center justify-between px-4"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center focus-ring rounded">
          <img
            src="/logo.svg"
            alt="G-TACTICAL"
            className={cn(
              'transition-all duration-300',
              isScrolled ? 'h-8' : 'h-10 md:h-12'
            )}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden font-display text-xl md:text-2xl font-bold text-primary ml-2">
            G-TACTICAL
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-foreground/80 hover:text-foreground transition-colors focus-ring rounded px-2 py-1"
            >
              {link.label}
            </button>
          ))}
          <Button
            onClick={() => scrollToSection('inscricao')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            Quero me inscrever
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 focus-ring rounded"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10 animate-fade-in"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-left text-foreground/80 hover:text-foreground transition-colors focus-ring rounded px-3 py-2"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection('inscricao')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full"
            >
              Quero me inscrever
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
