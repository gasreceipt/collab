'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/shared/Navigation';
import Hero from '@/components/shared/Hero';
import BrandCard from '@/components/shared/BrandCard';
import FeatureCard from '@/components/shared/FeatureCard';
import SectionHeader from '@/components/shared/SectionHeader';
import Footer from '@/components/shared/Footer';
import EmailSignup from '@/components/shared/EmailSignup';
import Button from '@/components/ui/Button';
import { FadeIn, Stagger } from '@/components/ui/AnimatedWrappers';
import { ArrowRight, Sparkles, Lightning, Leaf, Fire } from '@/components/ui/Icons';
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

  const heroCopyVariant = useABTest('hub_hero_copy', sessionId);
  const heroTitle = heroCopyVariant === 'variant_a' ? 'Three Brands, One Philosophy' : 'The vSMPL Ecosystem';

  const brands = [
    {
      name: 'Uniformish',
      tagline: 'Collapse & Rebirth',
      description: 'Apparel that outlives trends. Radically sustainable. Intentionally scarce. Each garment numbered, documented, and built to be your last purchase.',
      href: '/uniformish',
      accentColor: 'from-blue-900 via-blue-800 to-gray-900',
      textColor: 'text-blue-900',
      icon: <Leaf className="w-8 h-8" />,
      emoji: '👕',
      stats: ['Limited to 75 units per drop', '100% Organic materials', 'Lifetime repair guarantee'],
    },
    {
      name: 'Catnip Board Co.',
      tagline: 'Imperfection = Authenticity',
      description: 'Skateboard decks as canvases. Hand-painted by local artists. Every deck tells a story. Ride art, support creators, build community.',
      href: '/catnip',
      accentColor: 'from-orange-600 via-amber-500 to-yellow-600',
      textColor: 'text-orange-600',
      icon: <Fire className="w-8 h-8" />,
      emoji: '🛹',
      stats: ['Handmade by local artists', '40 decks per design', 'Community-funded skate parks'],
    },
    {
      name: 'Bad Arctic',
      tagline: 'Less is Everything',
      description: 'Sterling silver jewelry designed as artifacts. Minimalist forms with maximum intention. Pieces that age with you, develop patina, become heirlooms.',
      href: '/bad-arctic',
      accentColor: 'from-gray-300 via-gray-200 to-gray-100',
      textColor: 'text-gray-700',
      icon: <Sparkles className="w-8 h-8" />,
      emoji: '💍',
      stats: ['Hand-forged .925 silver', 'Limited batches (15-30)', 'Lifetime warranty'],
    },
  ];

  const values = [
    {
      title: 'Craft Over Mass Production',
      description: 'We make fewer things, better. Every product is numbered, traceable, and made with hands—not machines. Quality you can feel.',
      icon: <Lightning className="w-12 h-12" />,
    },
    {
      title: 'Scarcity by Design',
      description: 'Unlimited growth requires unlimited consumption. We reject that model. Limited runs mean what you own stays rare, valuable, meaningful.',
      icon: <Sparkles className="w-12 h-12" />,
    },
    {
      title: 'Authenticity Over Perfection',
      description: 'Imperfections prove authenticity. Hand-painted brush strokes. Natural patina. Fabric that evolves. Your products should age like you do.',
      icon: <Leaf className="w-12 h-12" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="light" currentPage="hub" />

      <Hero
        variant="gradient"
        badge={{ icon: <Sparkles className="w-4 h-4" />, text: 'Three brands. One ecosystem. Zero compromise.' }}
        title={heroTitle}
        subtitle={
          <>
            In a world drowning in mass-produced sameness, vSMPL is a rebellion.
            <br className="hidden md:block" />
            <strong className="text-black">Three distinct brands</strong> united by{' '}
            <strong className="text-black">intentional scarcity, radical transparency, and uncompromising craft.</strong>
          </>
        }
        buttons={[
          { label: 'Explore Brands', variant: 'primary', icon: <ArrowRight />, dataTrackId: 'hero-cta-explore' },
          { label: 'Read Manifesto', variant: 'outline', dataTrackId: 'hero-cta-manifesto' },
        ]}
      />

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionHeader title="The Ecosystem" subtitle="Three brands, three philosophies, one commitment: make less, make it better." />
          <Stagger staggerDelay={0.15}>
            {brands.map((brand) => (
              <div key={brand.name} className="mb-8 last:mb-0">
                <BrandCard {...brand} dataTrackId={`brand-card-${brand.name.toLowerCase().replace(' ', '-')}`} />
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader title="Why vSMPL Exists" subtitle="The consumer economy is broken. We're building an alternative—one product, one purchase, one promise at a time." />
          <div className="grid md:grid-cols-3 gap-8">
            <Stagger staggerDelay={0.2}>
              {values.map((value) => (
                <FeatureCard key={value.title} icon={value.icon} title={value.title} description={value.description} />
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="section-padding bg-black text-white">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">The vSMPL Manifesto</h2>
              <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-300">
                <p>
                  <strong className="text-white">We reject the myth of endless consumption.</strong> The apparel industry produces 100 billion garments annually. Most are worn less than 10 times. The skateboard market churns out millions of decks that crack and end up in landfills. Jewelry? Mass-produced overseas, designed to tarnish and be replaced.
                </p>
                <p><strong className="text-white">vSMPL is the antidote.</strong></p>
                <p>Uniformish makes apparel you buy once and wear for decades. Catnip Board Co. turns skateboard decks into collectible art. Bad Arctic crafts jewelry designed to become heirlooms.</p>
                <p>
                  <strong className="text-white">Scarcity isn't a marketing tactic—it's a production philosophy.</strong> Limited runs mean every product matters. When it's gone, it's gone. No restocks. No pre-orders. No FOMO manipulation. Just honest scarcity.
                </p>
                <p>
                  <strong className="text-white">This is commerce, reimagined.</strong> Not for everyone. Not for mass appeal. For people who value craft over convenience, scarcity over abundance, and meaning over trends.
                </p>
              </div>
              <div className="mt-12">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black" icon={<ArrowRight />} data-track-id="manifesto-cta">
                  Join the Movement
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container-custom text-center">
          <FadeIn>
            <SectionHeader title="Stay Connected" subtitle="Get early access to drops, behind-the-scenes stories, and ecosystem updates. No spam. Just craft." />
            <div className="flex justify-center">
              <EmailSignup variant="light" formType="email_signup" placeholder="Your email address" buttonText="Join Ecosystem" />
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
