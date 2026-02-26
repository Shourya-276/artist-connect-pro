import { Link } from 'react-router-dom';

const footerLinks = {
  Platform: [
    { label: 'Browse Artists', href: '/search' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'For Artists', href: '/artist/signup' },
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
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">A</span>
              </div>
              <span className="font-heading font-bold text-xl">ArtistHub</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              India's premier marketplace for booking artists for your events.
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
          © 2026 ArtistHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
