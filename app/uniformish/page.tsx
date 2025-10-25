'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/shared/Navigation';
import EmailSignup from '@/components/shared/EmailSignup';
import { getTracker } from '@/lib/tracking';
import { useABTest } from '@/lib/ab-testing';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  material: string;
  limited: number;
  sizes: string[];
}

export default function UniformishPage() {
  const [sessionId, setSessionId] = useState('');
  const tracker = typeof window !== 'undefined' ? getTracker() : null;

  useEffect(() => {
    if (tracker) {
      setSessionId(tracker.getSessionId());
    }
  }, [tracker]);

  // A/B test for hero image type
  const heroImageVariant = useABTest('uniformish_hero_image', sessionId);

  const products: Product[] = [
    {
      id: 'uniform-001',
      name: 'Essential Tee',
      price: 68,
      description: 'Heavy-weight organic cotton. Pre-shrunk. Built to last decades.',
      material: '100% Organic Cotton, 220 GSM',
      limited: 75,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      id: 'uniform-002',
      name: 'Work Jacket',
      price: 295,
      description: 'Durable canvas shell. Brass hardware. Improves with age.',
      material: 'Organic Canvas, Sterling Hardware',
      limited: 50,
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 'uniform-003',
      name: 'Utility Pant',
      price: 178,
      description: 'Reinforced seams. Articulated knees. Lifetime repair guarantee.',
      material: 'Japanese Twill, YKK Zippers',
      limited: 60,
      sizes: ['28', '30', '32', '34', '36', '38'],
    },
  ];

  const handleProductClick = (product: Product) => {
    if (tracker) {
      tracker.trackProductEngagement(product.id, product.name, 'click');
    }
  };

  return (
    <div className="min-h-screen bg-uniformish-bg text-uniformish-text">
      <Navigation variant="dark" currentPage="uniformish" />

      {/* Hero Section */}
      <section className="section-padding pt-32 hero">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-uniformish-accent font-medium mb-4 tracking-wide uppercase text-sm">
                Collapse & Rebirth
              </p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Apparel Built to Last Decades, Not Seasons
              </h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Limited edition drops. Sustainable materials. Radical transparency.
                Every piece is numbered, documented, and designed to be the last
                version you'll ever need to buy.
              </p>
              <div className="flex gap-4">
                <button
                  className="btn-primary bg-uniformish-accent text-white cta"
                  data-track-id="uniformish-cta-primary"
                >
                  View Current Drop
                </button>
                <button
                  className="btn-primary border border-white/20 text-white hover:bg-white/10"
                  data-track-id="uniformish-cta-secondary"
                >
                  Our Philosophy
                </button>
              </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="bg-uniformish-charcoal h-96 rounded-lg flex items-center justify-center">
              {heroImageVariant === 'variant_a' ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">👤</div>
                  <p className="text-sm text-gray-500">Lifestyle Shot</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">👕</div>
                  <p className="text-sm text-gray-500">Flat Lay</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="section-padding bg-black">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center">Why We Exist</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-uniformish-accent">Against Fast Fashion</h3>
              <p className="text-gray-400">
                The apparel industry produces 100 billion garments annually. Most are
                worn less than 10 times before disposal. Uniformish exists to collapse
                this wasteful cycle.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-uniformish-accent">Limited by Design</h3>
              <p className="text-gray-400">
                Every drop is limited to 50-75 units. We don't restock. When it's gone,
                it's gone. Scarcity isn't a marketing tactic—it's a production philosophy.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-uniformish-accent">Radical Transparency</h3>
              <p className="text-gray-400">
                Know exactly where your garment came from: mill location, dye process,
                labor costs, carbon footprint. We hide nothing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-4">Current Drop</h2>
          <p className="text-gray-400 mb-12 text-lg">
            Limited availability. Ships within 2 weeks of drop close.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-uniformish-charcoal rounded-lg overflow-hidden group cursor-pointer product-card product"
                data-track-id={`product-${product.id}`}
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image Placeholder */}
                <div className="h-80 bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                  <span className="text-6xl">👕</span>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <span className="text-uniformish-accent font-bold">${product.price}</span>
                  </div>

                  <p className="text-sm text-gray-400 mb-4">{product.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Material:</span>
                      <span className="text-gray-300">{product.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Limited:</span>
                      <span className="text-uniformish-accent font-medium">
                        {product.limited} units
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full mt-4 btn-primary bg-white text-black hover:bg-gray-200 cta"
                    data-track-id={`product-cta-${product.id}`}
                  >
                    Join Waitlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Material Details Section */}
      <section className="section-padding bg-uniformish-charcoal">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center">Material Specifications</h2>

          <div className="max-w-3xl mx-auto space-y-8">
            <div className="border-l-4 border-uniformish-accent pl-6">
              <h3 className="text-xl font-bold mb-2">Organic Cotton</h3>
              <p className="text-gray-400">
                Sourced from GOTS-certified farms in Turkey. Zero pesticides, zero GMOs.
                Heavy 220 GSM weight for durability and structure.
              </p>
            </div>

            <div className="border-l-4 border-uniformish-accent pl-6">
              <h3 className="text-xl font-bold mb-2">Natural Dyes</h3>
              <p className="text-gray-400">
                Plant-based dyes from indigo, walnut, and madder root. Colors evolve
                over time, creating unique patina and character.
              </p>
            </div>

            <div className="border-l-4 border-uniformish-accent pl-6">
              <h3 className="text-xl font-bold mb-2">Lifetime Repair</h3>
              <p className="text-gray-400">
                We repair your Uniformish garment for free, forever. Send it back and
                we'll make it right. Built to outlast trends, outlast you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Next Drop</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Get notified 48 hours before each limited drop goes live.
          </p>
          <div className="flex justify-center">
            <EmailSignup
              variant="dark"
              formType="waitlist"
              placeholder="Enter your email"
              buttonText="Notify Me"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/10">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Uniformish</h3>
              <p className="text-sm text-gray-500">
                Part of the vSMPL Ecosystem
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Current Drop
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Archive
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Size Guide
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Materials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Repairs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-white transition-colors social">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors social">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-sm text-gray-500 text-center">
            © 2024 Uniformish. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
