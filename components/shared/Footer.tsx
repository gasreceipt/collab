import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  brandName?: string;
  tagline?: string;
  sections?: FooterSection[];
  socialLinks?: FooterLink[];
}

const defaultSections: FooterSection[] = [
  {
    title: 'Brands',
    links: [
      { label: 'Uniformish', href: '/uniformish' },
      { label: 'Catnip Board Co.', href: '/catnip' },
      { label: 'Bad Arctic', href: '/bad-arctic' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Manifesto', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
  {
    title: 'Follow',
    links: [
      { label: 'Instagram', href: '#', isExternal: true },
      { label: 'Twitter', href: '#', isExternal: true },
    ],
  },
];

export default function Footer({
  brandName = 'vSMPL Ecosystem',
  tagline = 'Craft. Scarcity. Authenticity.',
  sections = defaultSections,
  socialLinks,
}: FooterProps) {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">{brandName}</h3>
            <p className="text-sm text-gray-400">{tagline}</p>
          </div>

          {/* Link Sections */}
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-medium mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        className="hover:text-white transition-colors social"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
