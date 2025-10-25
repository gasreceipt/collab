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
import { ArrowRight, Fire, Heart, Sparkles } from '@/components/ui/Icons';
import { getTracker } from '@/lib/tracking';
import { useABTest } from '@/lib/ab-testing';

export default function CatnipPage() {
  const [sessionId, setSessionId] = useState('');
  const tracker = typeof window !== 'undefined' ? getTracker() : null;

  useEffect(() => {
    if (tracker) {
      setSessionId(tracker.getSessionId());
    }
  }, [tracker]);

  const heroVideoVariant = useABTest('catnip_hero_video', sessionId);

  const decks = [
    {
      id: 'catnip-001',
      name: 'Sunset Sessions',
      price: 95,
      description: 'Hand-painted by Maya Chen. Each gradient is unique. No two sunsets are the same.',
      brand: 'catnip' as const,
      limited: 40,
      gradient: 'from-orange-400/20 to-pink-500/20',
      metadata: [
        { label: 'Artist', value: 'Maya Chen (Brooklyn)' },
        { label: 'Width', value: '8.25" | 7-ply maple' },
        { label: 'Edition', value: '#1-40 of 40' },
      ],
    },
    {
      id: 'catnip-002',
      name: 'Urban Flora',
      price: 105,
      description: 'Javier Ruiz's botanical line work meets street art. Ride-ready Canadian maple.',
      brand: 'catnip' as const,
      limited: 35,
      gradient: 'from-green-400/20 to-teal-500/20',
      metadata: [
        { label: 'Artist', value: 'Javier Ruiz (Austin)' },
        { label: 'Width', value: '8.5" | Street concave' },
        { label: 'Edition', value: '#1-35 of 35' },
      ],
    },
    {
      id: 'catnip-003',
      name: 'Night Shift',
      price: 110,
      description: 'Kenji Tanaka's blacklight reactive ink. Glow-in-the-dark details. Limited collab.',
      brand: 'catnip' as const,
      limited: 25,
      gradient: 'from-purple-600/20 to-indigo-700/20',
      metadata: [
        { label: 'Artist', value: 'Kenji Tanaka (Tokyo)' },
        { label: 'Width', value: '8.0" | Park-ready' },
        { label: 'Edition', value: '#1-25 of 25' },
      ],
    },
  ];

  const principles = [
    {
      title: 'Artist Collaborations',
      description: 'Every deck is designed by a local artist who gets 20% of sales. Art meets function meets fair pay. No corporate designs, no mass production. Just humans creating.',
      icon: <Sparkles className="w-12 h-12" />,
    },
    {
      title: 'Handmade Authenticity',
      description: "7-ply Canadian maple. Heat-pressed. Hand-painted details. No two decks are identical. The imperfections aren't mistakes—they're proof a human made this.",
      icon: <Heart className="w-12 h-12" />,
    },
    {
      title: 'Community Building',
      description: 'Catnip sponsors local skaters, funds DIY parks, and hosts monthly skate jams. We're not selling boards—we're building scenes. One deck at a time.',
      icon: <Fire className="w-12 h-12" />,
    },
  ];

  return (
    <div className="min-h-screen bg-catnip-bg text-catnip-text">
      <Navigation variant="light" currentPage="catnip" />

      <Hero
        variant="light"
        badge={{ icon: <Fire className="w-4 h-4" />, text: 'Imperfection = Authenticity' }}
        title="Art You Can Ride"
        subtitle={
          <>
            <strong className="text-black">Mass-produced decks have no soul.</strong>
            <br className="hidden md:block" />
            Catnip decks are hand-painted by local artists, numbered, and built to perform.
            <br className="hidden md:block" />
            Each one is different. That's the whole point.
          </>
        }
        buttons={[
          { label: 'Browse Decks', variant: 'primary', icon: <ArrowRight />, dataTrackId: 'catnip-cta-decks' },
          { label: 'Custom Orders', variant: 'outline', dataTrackId: 'catnip-cta-custom' },
        ]}
        backgroundGradient="from-catnip-accent/5 to-catnip-warm"
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader title="Why Handmade Matters" />
          <div className="grid md:grid-cols-3 gap-8">
            <Stagger staggerDelay={0.15}>
              {principles.map((principle) => (
                <FeatureCard key={principle.title} {...principle} />
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-catnip-accent/10 to-catnip-warm">
        <div className="container-custom">
          <SectionHeader
            title="Current Collection"
            subtitle="Limited runs. Hand-painted. Ships in 2-3 weeks. Artists get paid fairly."
          />
          <div className="grid md:grid-cols-3 gap-8">
            <Stagger staggerDelay={0.1}>
              {decks.map((deck) => (
                <ProductCard key={deck.id} {...deck} />
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <SectionHeader
                title="From the Community"
                subtitle="Real riders. Real stories. No paid influencers."
              />
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Stagger staggerDelay={0.1}>
                <FadeIn>
                  <div className="bg-gradient-to-br from-catnip-accent/5 to-catnip-warm/50 rounded-xl p-8 border-l-4 border-catnip-accent">
                    <p className="text-lg text-gray-800 mb-4 italic">
                      "Catnip decks feel like art you can ride. The imperfections make it yours. I've never felt more connected to my board."
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-catnip-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                        A
                      </div>
                      <div>
                        <p className="font-bold text-black">Alex Rivera</p>
                        <p className="text-sm text-gray-600">Brooklyn, NY</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn>
                  <div className="bg-gradient-to-br from-catnip-accent/5 to-catnip-warm/50 rounded-xl p-8 border-l-4 border-catnip-accent">
                    <p className="text-lg text-gray-800 mb-4 italic">
                      "Supporting local artists and riding custom wood? That's the whole vibe. Plus they sponsor our DIY park. Real community shit."
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-catnip-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                        S
                      </div>
                      <div>
                        <p className="font-bold text-black">Sam Wu</p>
                        <p className="text-sm text-gray-600">Portland, OR</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </Stagger>
            </div>

            <FadeIn>
              <div className="text-center">
                <button
                  className="btn-primary bg-catnip-wood text-white hover:bg-catnip-accent px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  data-track-id="catnip-community-cta"
                >
                  Join Our Crew
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Custom Deck Commissions</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Want something truly one-of-one? Commission a custom deck designed just for you.
                Work directly with our artists. Choose your wood, width, concave, and design.
                <strong className="text-white"> Your vision. Their hands. No compromises.</strong>
              </p>
              <button
                className="btn-primary bg-catnip-accent text-white hover:bg-catnip-wood px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                data-track-id="catnip-custom-cta"
              >
                Start Custom Order
              </button>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <SectionHeader
            title="Stay in the Loop"
            subtitle="Get notified about new drops, artist features, and skate events."
          />
          <div className="flex justify-center">
            <EmailSignup
              variant="light"
              formType="email_signup"
              placeholder="Enter your email"
              buttonText="Join the Crew"
            />
          </div>
        </div>
      </section>

      <Footer
        brandName="Catnip Board Co."
        tagline="Part of the vSMPL Ecosystem"
        sections={[
          {
            title: 'Shop',
            links: [
              { label: 'Current Decks', href: '#' },
              { label: 'Custom Orders', href: '#' },
              { label: 'Past Drops', href: '#' },
            ],
          },
          {
            title: 'Community',
            links: [
              { label: 'Featured Riders', href: '#' },
              { label: 'Events', href: '#' },
              { label: 'Sponsorships', href: '#' },
            ],
          },
          {
            title: 'Connect',
            links: [
              { label: 'Instagram', href: '#', isExternal: true },
              { label: 'TikTok', href: '#', isExternal: true },
            ],
          },
        ]}
      />
    </div>
  );
}
