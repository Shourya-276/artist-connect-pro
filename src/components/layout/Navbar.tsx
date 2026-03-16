import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, ChevronDown, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

import logo from '@/assets/Live101 2025 Logo.png';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Subscription', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHome
          ? 'glass shadow-sm'
          : 'bg-transparent'
          }`}
      >
        <div className="container-wide flex items-center justify-between h-16 lg:h-18">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Live101"
              className="h-14 lg:h-16 w-auto transition-transform hover:scale-105"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-red-600 ${location.pathname === link.href
                  ? link.label === 'Home' && !scrolled && isHome ? 'text-white' : 'text-red-600'
                  : link.label === 'Home' && !scrolled && isHome ? 'text-white' : !scrolled && isHome
                    ? 'text-primary-foreground/80 hover:text-primary-foreground'
                    : 'text-muted-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/admin/login">
              <Button variant="outline" size="sm" className={`hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors ${!scrolled && isHome ? 'border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10' : ''
                }`}>
                Admin
              </Button>
            </Link>
            <Link to="/artist/login">
              <Button variant="default" size="sm" className="bg-red-600 text-white hover:bg-red-700">
                Artist Login
              </Button>
            </Link>
            <Link to="/client/login">
              <Button variant="default" size="sm" className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700">
                <LayoutDashboard size={16} /> Client Login
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 ${!scrolled && isHome ? 'text-primary-foreground' : 'text-foreground'}`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-16 bg-background lg:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-lg font-medium py-3 border-b border-border text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <Link to="/admin/login">
                  <Button variant="outline" className="w-full hover:bg-red-600 hover:text-white hover:border-red-600">Admin Login</Button>
                </Link>
                <Link to="/artist/login">
                  <Button variant="default" className="w-full bg-red-600 text-white">Artist Login</Button>
                </Link>
                <Link to="/client/login">
                  <Button variant="default" className="w-full flex items-center justify-center gap-2 bg-red-600 text-white">
                    <LayoutDashboard size={18} /> Client Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
