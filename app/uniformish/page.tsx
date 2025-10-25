'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/shared/Navigation';
import Hero from '@/components/shared/Hero';
import SectionHeader from '@/components/shared/SectionHeader';
import FeatureCard from '@/components/shared/FeatureCard';
import Footer from '@/components/shared/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { FadeIn, Stagger } from '@/components/ui/AnimatedWrappers';
import { ArrowRight, Leaf, Lightning, Infinity } from '@/components/ui/Icons';
import { getTracker } from '@/lib/tracking';
import { useABTest } from '@/lib/ab-testing';

export default function UniformishPage() {
  const [sessionId, setSessionId] = useState('');
  const tracker = typeof window !== 'undefined' ? getTracker() : null;

  useEffect(() => {
    if (tracker) {
      setSessionId(tracker.getSessionId());
    }
  }, [tracker]);

  const heroImageVariant = useABTest('uniformish_hero_image', sessionId);

  const products = [
    {
      id: 'uniform-001',
      name: 'Essential Tee',
      price: 68,
      description: 'Heavy-weight organic cotton. Pre-shrunk. Built to last decades, not seasons.',
      brand: 'uniformish' as const,
      limited: 75,
      gradient: 'from-blue-900/10 to-blue-800/5',
      metadata: [
        { label: 'Material', value: '100% Organic Cotton, 220 GSM' },
        { label: 'Origin', value: 'Turkey (GOTS Certified)' },
        { label: 'Carbon', value: '2.3kg CO2 (offset)' },
      ],
    },
    {
      id: 'uniform-002',
      name: 'Work Jacket',
      price: 295,
      description: 'Durable canvas shell. Brass hardware. Improves with age like denim.',
      brand: 'uniformish' as const,
      limited: 50,
      gradient: 'from-blue-900/10 to-blue-800/5',
      metadata: [
        { label: 'Material', value: 'Organic Canvas, Sterling Hardware' },
        { label: 'Weight', value: '14oz per yard' },
        { label: 'Warranty', value: 'Lifetime repair' },
      ],
    },
    {
      id: 'uniform-003',
      name: 'Utility Pant',
      price: 178,
      description: 'Reinforced seams. Articulated knees. The last pants you'll ever buy.',
      brand: 'uniformish' as const,
      limited: 60,
      gradient: 'from-blue-900/10 to-blue-800/5',
      metadata: [
        { label: 'Material', value: 'Japanese Twill, YKK Zippers' },
        { label: 'Fit', value: 'Relaxed, tapered' },
        { label: 'Details', value: 'Triple-stitched, bar-tacked' },
      ],
    },
  ];

  const principles = [
    {
      title: 'Radical Transparency',
      description: 'Know exactly where your garment came from. Mill location, dye process, labor costs, carbon footprint. We publish everything. No secrets, no greenwashing.',
      icon: <Leaf className="w-12 h-12" />,
    },
    {
      title: 'Lifetime Guarantee',
      description: 'We repair your Uniformish garment for free, forever. Ripped seam? Send it back. Worn zipper? We'll replace it. Built to outlast you.',
      icon: <Infinity className="w-12 h-12" />,
    },
    {
      title: 'Honest Scarcity',
      description: 'Every drop is limited to 50-75 units. Not marketing—production reality. When it's gone, it's gone. No restocks. No pre-orders. Just truth.',
      icon: <Lightning className="w-12 h-12" />,
    },
  ];

  return (
    <div className="min-h-screen bg-uniformish-bg text-uniformish-text">
      <Navigation variant="dark" currentPage="uniformish" />

      <Hero
        variant="dark"
        badge={{ icon: <Leaf className="w-4 h-4" />, text: 'Collapse & Rebirth' }}
        title="The Last Apparel You'll Ever Buy"
        subtitle={
          <>
            <strong className="text-white">Uniformish rejects the 100 billion garment wasteland.</strong>
            <br className="hidden md:block" />
            Limited edition drops. Radical transparency. Lifetime repairs.
            <br className="hidden md:block" />
            Every piece numbered, documented, and built to outlast trends, seasons, and you.
          </>
        }
        buttons={[
          { label: 'View Current Drop', variant: 'primary', icon: <ArrowRight />, dataTrackId: 'uniformish-cta-drop' },
          { label: 'Our Philosophy', variant: 'outline', dataTrackId: 'uniformish-cta-philosophy' },
        ]}
      />

      <section className="section-padding bg-black">
        <div className="container-custom">
          <SectionHeader title="Why Uniformish Exists" />
          <div className="grid md:grid-cols-3 gap-8">
            <Stagger staggerDelay={0.15}>
              {principles.map((principle) => (
                <FeatureCard key={principle.title} {...principle} className="bg-uniformish-charcoal hover:bg-uniformish-charcoal/80 text-white" />
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            title="Current Drop"
            subtitle="Limited availability. Ships within 2 weeks. Every piece numbered and documented."
          />
          <div className="grid md:grid-cols-3 gap-8">
            <Stagger staggerDelay={0.1}>
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="section-padding bg-uniformish-charcoal">
        <div className="container-custom">
          <SectionHeader title="Material Obsession" subtitle="Where your garment comes from matters. Here's everything." />
          <div className="max-w-3xl mx-auto space-y-8">
            <FadeIn>
              <div className="border-l-4 border-uniformish-accent pl-6">
                <h3 className="text-xl font-bold mb-2">Organic Cotton (GOTS Certified)</h3>
                <p className="text-gray-400">
                  Sourced from certified farms in Turkey. Zero pesticides, zero GMOs. Heavy 220 GSM weight means durability and structure. Pre-washed to eliminate shrinkage.
                </p>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="border-l-4 border-uniformish-accent pl-6">
                <h3 className="text-xl font-bold mb-2">Natural Dyes Only</h3>
                <p className="text-gray-400">
                  Plant-based dyes from indigo, walnut, and madder root. No synthetic chemicals. Colors evolve over time, creating unique patina. Your garment ages with you.
                </p>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="border-l-4 border-uniformish-accent pl-6">
                <h3 className="text-xl font-bold mb-2">Lifetime Repair Policy</h3>
                <p className="text-gray-400">
                  Send it back, we'll fix it—for free, forever. Ripped? Patched. Faded? Re-dyed. Worn zipper? Replaced. We stand behind every stitch. Built to outlast trends, outlast you.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-blue-900/20 to-blue-800/10">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Carbon Accounting</h2>
              <p className="text-xl text-gray-300 mb-8">
                Every Uniformish product comes with a full carbon breakdown. We offset 120% of emissions through verified forestry projects. Transparency over marketing.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-black/30 rounded-lg p-6">
                  <div className="text-4xl font-bold text-uniformish-accent mb-2">2.3kg</div>
                  <div className="text-sm text-gray-400">CO2 per Essential Tee</div>
                </div>
                <div className="bg-black/30 rounded-lg p-6">
                  <div className="text-4xl font-bold text-uniformish-accent mb-2">120%</div>
                  <div className="text-sm text-gray-400">Carbon offset</div>
                </div>
                <div className="bg-black/30 rounded-lg p-6">
                  <div className="text-4xl font-bold text-uniformish-accent mb-2">0%</div>
                  <div className="text-sm text-gray-400">Greenwashing</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer
        brandName="Uniformish"
        tagline="Part of the vSMPL Ecosystem"
        sections={[
          {
            title: 'Shop',
            links: [
              { label: 'Current Drop', href: '#' },
              { label: 'Archive', href: '#' },
              { label: 'Size Guide', href: '#' },
            ],
          },
          {
            title: 'About',
            links: [
              { label: 'Our Story', href: '#' },
              { label: 'Materials', href: '#' },
              { label: 'Repairs', href: '#' },
            ],
          },
          {
            title: 'Connect',
            links: [
              { label: 'Instagram', href: '#', isExternal: true },
              { label: 'Contact', href: '#' },
            ],
          },
        ]}
      />
    </div>
  );
}
