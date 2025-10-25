'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/shared/Navigation';
import EmailSignup from '@/components/shared/EmailSignup';
import { getTracker } from '@/lib/tracking';
import { useABTest } from '@/lib/ab-testing';

interface JewelryPiece {
  id: string;
  name: string;
  price: number;
  description: string;
  material: string;
  dimensions: string;
  limited: number;
}

export default function BadArcticPage() {
  const [sessionId, setSessionId] = useState('');
  const tracker = typeof window !== 'undefined' ? getTracker() : null;

  useEffect(() => {
    if (tracker) {
      setSessionId(tracker.getSessionId());
    }
  }, [tracker]);

  // A/B test for pricing display
  const pricingVariant = useABTest('badArctic_pricing', sessionId);

  // A/B test for CTA type
  const ctaVariant = useABTest('badArctic_cta', sessionId);
  const ctaText = ctaVariant === 'variant_a' ? 'Join Waitlist' : 'Commission Piece';

  const pieces: JewelryPiece[] = [
    {
      id: 'arctic-001',
      name: 'Crescent Ring',
      price: 245,
      description: 'Hand-forged sterling silver. Minimal silhouette. Timeless elegance.',
      material: '.925 Sterling Silver',
      dimensions: '2mm band, adjustable',
      limited: 30,
    },
    {
      id: 'arctic-002',
      name: 'Horizon Pendant',
      price: 320,
      description: 'Minimalist pendant inspired by arctic horizons. Includes sterling chain.',
      material: '.925 Sterling Silver',
      dimensions: '18" chain, 15mm pendant',
      limited: 25,
    },
    {
      id: 'arctic-003',
      name: 'Glacier Cuff',
      price: 485,
      description: 'Statement cuff bracelet. Textured finish. Made to order.',
      material: '.925 Sterling Silver',
      dimensions: '8mm wide, adjustable',
      limited: 15,
    },
  ];

  const handlePieceClick = (piece: JewelryPiece) => {
    if (tracker) {
      tracker.trackProductEngagement(piece.id, piece.name, 'click');
    }
  };

  // Show price range vs individual pricing based on A/B test
  const priceDisplay = pricingVariant === 'variant_a' ? 'range' : 'individual';

  return (
    <div className="min-h-screen bg-badArctic-bg text-badArctic-text font-serif">
      <Navigation variant="light" currentPage="bad-arctic" />

      {/* Hero Section */}
      <section className="section-padding pt-32 hero">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-badArctic-accent font-medium mb-6 tracking-widest uppercase text-sm">
              Less is Everything
            </p>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Sterling Silver Artifacts
            </h1>
            <p className="text-2xl text-gray-600 mb-12 leading-relaxed font-sans">
              Jewelry designed as artifacts. Minimalist luxury. Crafted to last forever.
              Each piece is a meditation on form, function, and permanence.
            </p>

            {/* Hero Image/Visual */}
            <div className="bg-badArctic-ice rounded-lg h-96 flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="text-7xl mb-4">💍</div>
                <p className="text-sm text-gray-500 font-sans">Macro Jewelry Photography</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                className="btn-primary bg-black text-white hover:bg-gray-800 cta"
                data-track-id="bad-arctic-cta-primary"
              >
                {ctaText}
              </button>
              <button
                className="btn-primary border border-gray-300 text-gray-900 hover:bg-gray-50"
                data-track-id="bad-arctic-cta-secondary"
              >
                View Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-badArctic-ice">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Our Philosophy</h2>

            <div className="space-y-8 text-lg text-gray-700 leading-relaxed font-sans">
              <p>
                Bad Arctic creates jewelry as artifacts—pieces designed to transcend trends,
                outlast seasons, and become heirlooms. We work exclusively in .925 sterling
                silver, chosen for its durability, patina, and timeless appeal.
              </p>

              <p>
                Every piece is hand-forged in small batches. We believe in the philosophy of
                "less is everything"—minimal design, maximum impact. No embellishments.
                No excess. Just pure form and intentional craftsmanship.
              </p>

              <p>
                When you wear Bad Arctic, you're wearing a piece that will age with you,
                develop character over decades, and tell your story through patina and wear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Showcase */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Current Collection</h2>
            {priceDisplay === 'range' ? (
              <p className="text-xl text-gray-600 font-sans">
                Sterling silver pieces from $245 to $485
              </p>
            ) : (
              <p className="text-xl text-gray-600 font-sans">
                Hand-forged in limited batches
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {pieces.map((piece) => (
              <div
                key={piece.id}
                className="group cursor-pointer product-card product"
                data-track-id={`jewelry-${piece.id}`}
                onClick={() => handlePieceClick(piece)}
              >
                {/* Piece Image */}
                <div className="bg-badArctic-platinum h-96 rounded-lg mb-6 flex items-center justify-center group-hover:bg-badArctic-ice transition-colors">
                  <span className="text-8xl group-hover:scale-110 transition-transform">💍</span>
                </div>

                {/* Piece Details */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{piece.name}</h3>
                  {priceDisplay === 'individual' && (
                    <p className="text-lg text-badArctic-accent mb-3 font-sans">${piece.price}</p>
                  )}
                  <p className="text-gray-600 mb-4 font-sans">{piece.description}</p>

                  <div className="space-y-1 text-sm text-gray-500 mb-6 font-sans">
                    <p>{piece.material}</p>
                    <p>{piece.dimensions}</p>
                    <p className="text-xs">Limited to {piece.limited} pieces</p>
                  </div>

                  <button
                    className="btn-primary bg-black text-white hover:bg-gray-800 w-full cta"
                    data-track-id={`jewelry-cta-${piece.id}`}
                  >
                    {ctaText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Documentation */}
      <section className="section-padding bg-badArctic-ice">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center">The Making Of</h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Design Process */}
            <div>
              <div className="bg-white rounded-lg p-8 h-64 flex items-center justify-center mb-6">
                <span className="text-6xl">✏️</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Design & Sketch</h3>
              <p className="text-gray-700 font-sans">
                Every piece begins as a hand-drawn sketch. We iterate on form,
                proportion, and balance until the design feels inevitable—like it
                always existed.
              </p>
            </div>

            {/* Forging Process */}
            <div>
              <div className="bg-white rounded-lg p-8 h-64 flex items-center justify-center mb-6">
                <span className="text-6xl">🔨</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Hand Forging</h3>
              <p className="text-gray-700 font-sans">
                Using traditional silversmithing techniques, we forge each piece from
                raw sterling silver. Heat, hammer, and patience create the final form.
              </p>
            </div>

            {/* Finishing */}
            <div>
              <div className="bg-white rounded-lg p-8 h-64 flex items-center justify-center mb-6">
                <span className="text-6xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Finishing</h3>
              <p className="text-gray-700 font-sans">
                Each piece is hand-finished: polished, oxidized, or brushed depending
                on the desired texture. Final inspection ensures perfection.
              </p>
            </div>

            {/* Quality Control */}
            <div>
              <div className="bg-white rounded-lg p-8 h-64 flex items-center justify-center mb-6">
                <span className="text-6xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Quality Assurance</h3>
              <p className="text-gray-700 font-sans">
                Before shipping, every piece is tested for durability, checked for
                imperfections, and stamped with our .925 hallmark. We guarantee quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Material Details */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Material & Care</h2>

            <div className="space-y-6 font-sans text-gray-700">
              <div className="border-l-4 border-badArctic-accent pl-6">
                <h3 className="text-xl font-bold mb-2 font-serif">Sterling Silver Purity</h3>
                <p>
                  All Bad Arctic pieces are .925 sterling silver (92.5% pure silver, 7.5%
                  alloy for strength). Certified and hallmarked.
                </p>
              </div>

              <div className="border-l-4 border-badArctic-accent pl-6">
                <h3 className="text-xl font-bold mb-2 font-serif">Patina & Aging</h3>
                <p>
                  Sterling silver develops a natural patina over time. This is intentional—
                  it adds character and depth. We provide polishing cloths if you prefer
                  a brighter finish.
                </p>
              </div>

              <div className="border-l-4 border-badArctic-accent pl-6">
                <h3 className="text-xl font-bold mb-2 font-serif">Lifetime Warranty</h3>
                <p>
                  We repair or replace any Bad Arctic piece, forever. If it breaks, we'll
                  fix it. If it's lost, we'll offer a replacement discount. Built to last
                  generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Commissions */}
      <section className="section-padding bg-badArctic-platinum">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Custom Commissions</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-sans">
            Work directly with our silversmiths to create a one-of-one piece designed
            specifically for you. Starting at $500.
          </p>
          <button
            className="btn-primary bg-black text-white hover:bg-gray-800 cta"
            data-track-id="bad-arctic-custom-commission"
          >
            Inquire About Commissions
          </button>
        </div>
      </section>

      {/* Email Signup */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-sans">
            Get early access to new pieces, behind-the-scenes process updates, and
            commission opportunities.
          </p>
          <div className="flex justify-center">
            <EmailSignup
              variant="light"
              formType="waitlist"
              placeholder="Enter your email"
              buttonText="Join Waitlist"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Bad Arctic</h3>
              <p className="text-sm text-gray-400 font-sans">
                Part of the vSMPL Ecosystem
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-sans">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Current Collection
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Custom Commissions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Gift Cards
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-sans">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Craftsmanship
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Care Guide
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-sans">
                <li>
                  <a href="#" className="hover:text-white transition-colors social">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors social">
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-sm text-gray-400 text-center font-sans">
            © 2024 Bad Arctic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
