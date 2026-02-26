import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Browse Artists', href: '/search' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome
            ? 'glass shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container-wide flex items-center justify-between h-16 lg:h-18">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
            <span className={`font-heading font-bold text-xl ${
              !scrolled && isHome ? 'text-primary-foreground' : 'text-foreground'
            }`}>
              ArtistHub
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? 'text-primary'
                    : !scrolled && isHome
                    ? 'text-primary-foreground/80 hover:text-primary-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/artist/signup">
              <Button variant="ghost" size="sm" className={`${
                !scrolled && isHome ? 'text-primary-foreground hover:bg-primary-foreground/10' : ''
              }`}>
                Join as Artist
              </Button>
            </Link>
            <Link to="/client/signup">
              <Button variant="default" size="sm">
                Book Artists
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm" className={`${
                !scrolled && isHome ? 'border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10' : ''
              }`}>
                Admin
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
                <Link to="/artist/signup">
                  <Button variant="outline" className="w-full">Join as Artist</Button>
                </Link>
                <Link to="/client/signup">
                  <Button className="w-full">Book Artists</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
