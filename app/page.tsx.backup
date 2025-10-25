'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/shared/Navigation';
import EmailSignup from '@/components/shared/EmailSignup';
import { getTracker } from '@/lib/tracking';
import { useABTest } from '@/lib/ab-testing';

export default function HubPage() {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tracker = getTracker();
      setSessionId(tracker.getSessionId());
    }
  }, []);

  // A/B test for hero copy
  const heroCopyVariant = useABTest('hub_hero_copy', sessionId);
  const heroTitle =
    heroCopyVariant === 'variant_a'
      ? 'Three Brands, One Philosophy'
      : 'The vSMPL Ecosystem';

  const brands = [
    {
      name: 'Uniformish',
      tagline: 'Collapse & Rebirth',
      description: 'Sustainable minimalist apparel. Limited edition drops. Built to last.',
      href: '/uniformish',
      accentColor: 'bg-uniformish-accent',
      textColor: 'text-uniformish-accent',
      image: '/images/uniformish-preview.jpg',
    },
    {
      name: 'Catnip Board Co.',
      tagline: 'Imperfection = Authenticity',
      description: 'Handmade skateboard decks. Artist collaborations. Community-driven.',
      href: '/catnip',
      accentColor: 'bg-catnip-accent',
      textColor: 'text-catnip-accent',
      image: '/images/catnip-preview.jpg',
    },
    {
      name: 'Bad Arctic',
      tagline: 'Less is Everything',
      description: 'Sterling silver jewelry artifacts. Minimalist luxury. Crafted forever.',
      href: '/bad-arctic',
      accentColor: 'bg-badArctic-accent',
      textColor: 'text-badArctic-accent',
      image: '/images/bad-arctic-preview.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="light" currentPage="hub" />

      {/* Hero Section */}
      <section className="section-padding pt-32 hero">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Three interconnected brands united by craft, scarcity, and authenticity.
            Beyond transactional. Beyond commerce. A curated ecosystem of intentional creation.
          </p>
        </div>
      </section>

      {/* Brand Cards Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {brands.map((brand, index) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="group product-card"
                data-track-id={`brand-card-${brand.name.toLowerCase().replace(' ', '-')}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
                  {/* Image Placeholder */}
                  <div className={`h-64 ${brand.accentColor} bg-opacity-10 flex items-center justify-center`}>
                    <span className={`text-6xl font-bold ${brand.textColor} opacity-20`}>
                      {brand.name.charAt(0)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{brand.name}</h3>
                    <p className={`text-sm font-medium mb-3 ${brand.textColor}`}>
                      {brand.tagline}
                    </p>
                    <p className="text-gray-600 mb-4">{brand.description}</p>

                    <div className="flex items-center gap-2 font-medium cta">
                      Explore
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Why Three Brands?</h2>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                In a world of endless consumption and algorithmic sameness, we believe in the power of
                intentional creation. vSMPL is not a company—it's an ecosystem of three distinct brands
                that share a common philosophy: craft over mass production, scarcity over abundance,
                authenticity over perfection.
              </p>

              <p>
                <strong className="text-black">Uniformish</strong> reimagines sustainable apparel through
                limited drops and material transparency. <strong className="text-black">Catnip Board Co.</strong>{' '}
                celebrates skateboard culture with handmade decks and community storytelling.{' '}
                <strong className="text-black">Bad Arctic</strong> crafts sterling silver jewelry as
                wearable artifacts, designed to last forever.
              </p>

              <p>
                Each brand operates independently, but together they form a cohesive narrative: that what
                you wear, ride, and carry can be more than products—they can be expressions of who you are
                and what you value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Ecosystem</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get early access to drops, behind-the-scenes stories, and ecosystem updates.
          </p>
          <div className="flex justify-center">
            <EmailSignup
              variant="light"
              formType="email_signup"
              placeholder="Enter your email"
              buttonText="Subscribe"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">vSMPL Ecosystem</h3>
              <p className="text-sm text-gray-400">
                Craft. Scarcity. Authenticity.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Brands</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/uniformish" className="hover:text-white transition-colors">
                    Uniformish
                  </Link>
                </li>
                <li>
                  <Link href="/catnip" className="hover:text-white transition-colors">
                    Catnip Board Co.
                  </Link>
                </li>
                <li>
                  <Link href="/bad-arctic" className="hover:text-white transition-colors">
                    Bad Arctic
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Follow</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors social">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors social">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors social">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-sm text-gray-400 text-center">
            © 2024 vSMPL Ecosystem. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
