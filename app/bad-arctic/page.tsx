'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/shared/Navigation';
import Hero from '@/components/shared/Hero';
import SectionHeader from '@/components/shared/SectionHeader';
import FeatureCard from '@/components/shared/FeatureCard';
import Footer from '@/components/shared/Footer';
import ProductCard from '@/components/ui/ProductCard';
import EmailSignup from '@/components/shared/EmailSignup';
import { FadeIn, Stagger } from '@/components/ui/AnimatedWrappers';
import { ArrowRight, Infinity, Sparkles, Check } from '@/components/ui/Icons';
import { getTracker } from '@/lib/tracking';
import { useABTest } from '@/lib/ab-testing';

export default function BadArcticPage() {
  const [sessionId, setSessionId] = useState('');
  const tracker = typeof window !== 'undefined' ? getTracker() : null;

  useEffect(() => {
    if (tracker) {
      setSessionId(tracker.getSessionId());
    }
  }, [tracker]);

  const pricingVariant = useABTest('badArctic_pricing', sessionId);
  const ctaVariant = useABTest('badArctic_cta', sessionId);

  const pieces = [
    {
      id: 'arctic-001',
      name: 'Crescent Ring',
      price: 245,
      description: 'Hand-forged sterling silver. Minimal silhouette. Designed to become an heirloom.',
      brand: 'bad-arctic' as const,
      limited: 30,
      gradient: 'from-gray-100 to-gray-200',
      metadata: [
        { label: 'Material', value: '.925 Sterling Silver' },
        { label: 'Dimensions', value: '2mm band, adjustable' },
        { label: 'Warranty', value: 'Lifetime guarantee' },
      ],
    },
    {
      id: 'arctic-002',
      name: 'Horizon Pendant',
      price: 320,
      description: 'Inspired by arctic horizons. Hand-finished. Includes 18" sterling chain.',
      brand: 'bad-arctic' as const,
      limited: 25,
      gradient: 'from-gray-100 to-gray-200',
      metadata: [
        { label: 'Material', value: '.925 Sterling Silver' },
        { label: 'Chain', value: '18" with lobster clasp' },
        { label: 'Pendant', value: '15mm diameter' },
      ],
    },
    {
      id: 'arctic-003',
      name: 'Glacier Cuff',
      price: 485,
      description: 'Statement cuff bracelet. Textured finish. Made to order in 3-4 weeks.',
      brand: 'bad-arctic' as const,
      limited: 15,
      gradient: 'from-gray-100 to-gray-200',
      metadata: [
        { label: 'Material', value: '.925 Sterling Silver' },
        { label: 'Width', value: '8mm wide, adjustable' },
        { label: 'Finish', value: 'Brushed texture' },
      ],
    },
  ];

  const philosophy = [
    {
      title: 'Artifacts, Not Accessories',
      description: 'Bad Arctic creates jewelry as artifacts—pieces designed to transcend trends and become heirlooms. Sterling silver ages beautifully, developing patina that tells your story.',
      icon: <Infinity className="w-12 h-12" />,
    },
    {
      title: 'Minimal Design Philosophy',
      description: '"Less is everything." No embellishments. No excess. Just pure form, intentional craftsmanship, and timeless elegance. Every line has purpose.',
      icon: <Sparkles className="w-12 h-12" />,
    },
    {
      title: 'Lifetime Warranty',
      description: 'We repair or replace any Bad Arctic piece, forever. Broken? We\'ll fix it. Lost? Replacement discount. These pieces are built to outlast you.',
      icon: <Check className="w-12 h-12" />,
    },
  ];

  const craftsmanship = [
    {
      title: 'Design & Sketch',
      description: 'Every piece begins as a hand-drawn sketch. We iterate on form, proportion, and balance until the design feels inevitable—like it always existed.',
      icon: '✏️',
    },
    {
      title: 'Hand Forging',
      description: 'Using traditional silversmithing techniques, we forge each piece from raw sterling silver. Heat, hammer, and patience create the final form.',
      icon: '🔨',
    },
    {
      title: 'Finishing',
      description: 'Each piece is hand-finished: polished, oxidized, or brushed depending on the desired texture. Final inspection ensures perfection.',
      icon: '✨',
    },
    {
      title: 'Quality Assurance',
      description: 'Before shipping, every piece is tested for durability, checked for imperfections, and stamped with our .925 hallmark. We guarantee quality.',
      icon: '🔍',
    },
  ];

  return (
    <div className="min-h-screen bg-badArctic-bg text-badArctic-text font-serif">
      <Navigation variant="light" currentPage="bad-arctic" />

      <Hero
        variant="light"
        badge={{ icon: <Sparkles className="w-4 h-4" />, text: 'Less is Everything' }}
        title="Sterling Silver Artifacts"
        subtitle={
          <>
            <strong className="text-black">Jewelry designed as artifacts.</strong>
            <br className="hidden md:block" />
            Minimalist luxury. Hand-forged in .925 sterling silver. Crafted to last forever.
            <br className="hidden md:block" />
            Each piece is a meditation on form, function, and permanence.
          </>
        }
        buttons={[
          {
            label: ctaVariant === 'variant_a' ? 'Join Waitlist' : 'Commission Piece',
            variant: 'primary',
            icon: <ArrowRight />,
            dataTrackId: 'bad-arctic-cta-primary'
          },
          { label: 'View Collection', variant: 'outline', dataTrackId: 'bad-arctic-cta-secondary' },
        ]}
        backgroundGradient="from-badArctic-platinum to-badArctic-ice"
      />

      <section className="section-padding bg-badArctic-ice">
        <div className="container-custom">
          <SectionHeader title="Our Philosophy" />
          <Stagger staggerDelay={0.15} className="feature-grid">
            {philosophy.map((item) => (
              <FeatureCard key={item.title} {...item} variant="elevated" />
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            title="Current Collection"
            subtitle={
              pricingVariant === 'variant_a'
                ? 'Sterling silver pieces from $245 to $485'
                : 'Hand-forged in limited batches. Ships in 2-4 weeks.'
            }
          />
          <Stagger staggerDelay={0.1} className="product-grid">
            {pieces.map((piece) => (
              <ProductCard key={piece.id} {...piece} />
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-padding bg-badArctic-ice">
        <div className="container-custom">
          <SectionHeader title="The Making Of" subtitle="Every piece is hand-forged using traditional silversmithing techniques" />

          <Stagger staggerDelay={0.1} className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {craftsmanship.map((item) => (
              <FadeIn key={item.title}>
                <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
                  <div className="text-6xl mb-6 text-center">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-center">{item.title}</h3>
                  <p className="text-gray-700 font-sans text-center leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <SectionHeader title="Material & Care" />

            <div className="space-y-6">
              <Stagger staggerDelay={0.1}>
                <FadeIn>
                  <div className="border-l-4 border-badArctic-accent pl-6">
                    <h3 className="text-xl font-bold mb-2">Sterling Silver Purity</h3>
                    <p className="text-gray-700 font-sans">
                      All Bad Arctic pieces are .925 sterling silver (92.5% pure silver, 7.5% alloy for strength).
                      Certified, hallmarked, and ethically sourced.
                    </p>
                  </div>
                </FadeIn>

                <FadeIn>
                  <div className="border-l-4 border-badArctic-accent pl-6">
                    <h3 className="text-xl font-bold mb-2">Patina & Aging</h3>
                    <p className="text-gray-700 font-sans">
                      Sterling silver develops a natural patina over time. This is intentional—it adds character and depth.
                      Your piece will age with you. We provide polishing cloths if you prefer a brighter finish.
                    </p>
                  </div>
                </FadeIn>

                <FadeIn>
                  <div className="border-l-4 border-badArctic-accent pl-6">
                    <h3 className="text-xl font-bold mb-2">Lifetime Warranty</h3>
                    <p className="text-gray-700 font-sans">
                      We repair or replace any Bad Arctic piece, forever. If it breaks, we'll fix it. If it's lost, we'll offer a replacement discount.
                      <strong className="text-black"> Built to last generations.</strong>
                    </p>
                  </div>
                </FadeIn>
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container-custom text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Custom Commissions</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-sans leading-relaxed">
              Work directly with our silversmiths to create a one-of-one piece designed specifically for you.
              Engagement rings, memorial pieces, or something entirely unique.
              <strong className="text-white"> Starting at $500. Timeline: 6-8 weeks.</strong>
            </p>
            <button
              className="btn-primary bg-badArctic-accent text-white hover:bg-badArctic-platinum hover:text-black px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              data-track-id="bad-arctic-custom-commission"
            >
              Inquire About Commissions
            </button>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-badArctic-platinum">
        <div className="container-custom text-center">
          <SectionHeader
            title="Join Our Community"
            subtitle="Get early access to new pieces, behind-the-scenes process updates, and commission opportunities."
          />
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

      <Footer
        brandName="Bad Arctic"
        tagline="Part of the vSMPL Ecosystem"
        sections={[
          {
            title: 'Shop',
            links: [
              { label: 'Current Collection', href: '#' },
              { label: 'Custom Commissions', href: '#' },
              { label: 'Gift Cards', href: '#' },
            ],
          },
          {
            title: 'About',
            links: [
              { label: 'Our Story', href: '#' },
              { label: 'Craftsmanship', href: '#' },
              { label: 'Care Guide', href: '#' },
            ],
          },
          {
            title: 'Connect',
            links: [
              { label: 'Instagram', href: '#', isExternal: true },
              { label: 'Pinterest', href: '#', isExternal: true },
            ],
          },
        ]}
      />
    </div>
  );
}
