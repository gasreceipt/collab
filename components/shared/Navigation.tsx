'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavigationProps {
  variant?: 'light' | 'dark';
  currentPage?: 'hub' | 'uniformish' | 'catnip' | 'bad-arctic';
}

export default function Navigation({ variant = 'light', currentPage = 'hub' }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = variant === 'dark';

  const links = [
    { href: '/', label: 'Home', page: 'hub' },
    { href: '/uniformish', label: 'Uniformish', page: 'uniformish' },
    { href: '/catnip', label: 'Catnip', page: 'catnip' },
    { href: '/bad-arctic', label: 'Bad Arctic', page: 'bad-arctic' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDark ? 'bg-black/90' : 'bg-white/90'
      } backdrop-blur-sm`}
    >
      <div className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`text-xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-black'
          } nav`}
          data-track-id="nav-logo"
        >
          vSMPL
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors nav ${
                currentPage === link.page
                  ? isDark
                    ? 'text-white'
                    : 'text-black'
                  : isDark
                  ? 'text-white/60 hover:text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
              data-track-id={`nav-${link.page}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden ${isDark ? 'text-white' : 'text-black'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          data-track-id="nav-mobile-toggle"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden ${
            isDark ? 'bg-black' : 'bg-white'
          } border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}
        >
          <div className="container-custom py-4 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors nav ${
                  currentPage === link.page
                    ? isDark
                      ? 'text-white'
                      : 'text-black'
                    : isDark
                    ? 'text-white/60 hover:text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-track-id={`nav-mobile-${link.page}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
