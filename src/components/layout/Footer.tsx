import { Link } from 'react-router-dom';

import logo from '@/assets/Live101 2025 Logo.png';

const footerLinks = {
  Platform: [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Subscription', href: '/pricing' },
    { label: 'Artist Login', href: '/artist/login' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
  ],
  Categories: [
    { label: 'Singers', href: '/search?category=singer' },
    { label: 'DJs', href: '/search?category=dj' },
    { label: 'Bands', href: '/search?category=band' },
    { label: 'Comedians', href: '/search?category=comedian' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Live101" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              India's Premier Marketplace For Booking Artists For Your Events.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-background/10 mt-12 pt-8 text-center text-sm text-background/40">
          © {new Date().getFullYear()} Live101. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
