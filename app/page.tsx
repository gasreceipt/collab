'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/shared/Navigation';
import EmailSignup from '@/components/shared/EmailSignup';
import Button, { ButtonGroup } from '@/components/ui/Button';
import { FadeIn, Stagger, ScaleOnHover } from '@/components/ui/AnimatedWrappers';
import { ArrowRight, Sparkles, Lightning, Leaf, Fire } from '@/components/ui/Icons';
import { getTracker } from '@/lib/tracking';
import { useABTest } from '@/lib/ab-testing';
import { motion } from 'framer-motion';

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
      description: 'Apparel that outlives trends. Radically sustainable. Intentionally scarce. Each garment numbered, documented, and built to be your last purchase.',
      href: '/uniformish',
      accentColor: 'from-blue-900 via-blue-800 to-gray-900',
      borderColor: 'border-blue-900',
      textColor: 'text-blue-900',
      icon: <Leaf className="w-8 h-8" />,
      stats: ['Limited to 75 units per drop', '100% Organic materials', 'Lifetime repair guarantee'],
    },
    {
      name: 'Catnip Board Co.',
      tagline: 'Imperfection = Authenticity',
      description: 'Skateboard decks as canvases. Hand-painted by local artists. Every deck tells a story. Ride art, support creators, build community.',
      href: '/catnip',
      accentColor: 'from-orange-600 via-amber-500 to-yellow-600',
      borderColor: 'border-orange-600',
      textColor: 'text-orange-600',
      icon: <Fire className="w-8 h-8" />,
      stats: ['Handmade by local artists', '40 decks per design', 'Community-funded skate parks'],
    },
    {
      name: 'Bad Arctic',
      tagline: 'Less is Everything',
      description: 'Sterling silver jewelry designed as artifacts. Minimalist forms with maximum intention. Pieces that age with you, develop patina, become heirlooms.',
      href: '/bad-arctic',
      accentColor: 'from-gray-300 via-gray-200 to-gray-100',
      borderColor: 'border-gray-400',
      textColor: 'text-gray-700',
      icon: <Sparkles className="w-8 h-8" />,
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

      {/* Hero Section */}
      <section className="relative section-padding pt-32 overflow-hidden">
        {/* Background gradient animation */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-orange-50 to-gray-100"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </div>

        <div className="container-custom text-center relative z-10">
          <FadeIn delay={0.1}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="inline-block mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full border border-black/10">
                <Sparkles className="w-4 h-4 text-black" />
                <span className="text-sm font-medium text-black">Three brands. One ecosystem. Zero compromise.</span>
              </div>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-none">
              {heroTitle}
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
              In a world drowning in mass-produced sameness, vSMPL is a rebellion.
              <br className="hidden md:block" />
              <strong className="text-black">Three distinct brands</strong> united by{' '}
              <strong className="text-black">intentional scarcity, radical transparency, and uncompromising craft.</strong>
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <ButtonGroup className="justify-center">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight />}
                data-track-id="hero-cta-explore"
              >
                Explore Brands
              </Button>
              <Button
                variant="outline"
                size="lg"
                data-track-id="hero-cta-manifesto"
              >
                Read Manifesto
              </Button>
            </ButtonGroup>
          </FadeIn>
        </div>
      </section>

      {/* Brand Cards Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">The Ecosystem</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Three brands, three philosophies, one commitment: make less, make it better.
              </p>
            </div>
          </FadeIn>

          <Stagger staggerDelay={0.15}>
            {brands.map((brand) => (
              <Link key={brand.name} href={brand.href}>
                <ScaleOnHover>
                  <motion.div
                    className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group mb-8 last:mb-0"
                    whileHover={{ y: -4 }}
                    data-track-id={`brand-card-${brand.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                      {/* Left: Content */}
                      <div className="flex flex-col justify-center">
                        <div className={`inline-flex mb-4 ${brand.textColor}`}>
                          {brand.icon}
                        </div>

                        <h3 className="text-4xl font-bold mb-2">{brand.name}</h3>

                        <p className={`text-lg font-semibold mb-4 ${brand.textColor}`}>
                          {brand.tagline}
                        </p>

                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                          {brand.description}
                        </p>

                        <div className="space-y-2 mb-6">
                          {brand.stats.map((stat, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className={`mt-1 ${brand.textColor}`}>✓</span>
                              <span className="text-sm text-gray-600">{stat}</span>
                            </div>
                          ))}
                        </div>

                        <div>
                          <Button
                            variant="primary"
                            icon={<ArrowRight />}
                            data-track-id={`brand-cta-${brand.name}`}
                          >
                            Explore {brand.name}
                          </Button>
                        </div>
                      </div>

                      {/* Right: Visual */}
                      <div className="relative h-80 md:h-auto">
                        <div className={`absolute inset-0 bg-gradient-to-br ${brand.accentColor} rounded-xl`}>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />

                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              className="text-9xl opacity-30"
                              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                            >
                              {brand.name === 'Uniformish' && '👕'}
                              {brand.name === 'Catnip Board Co.' && '🛹'}
                              {brand.name === 'Bad Arctic' && '💍'}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${brand.accentColor} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                  </motion.div>
                </ScaleOnHover>
              </Link>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Why vSMPL Exists</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The consumer economy is broken. We're building an alternative—one product, one purchase, one promise at a time.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <Stagger staggerDelay={0.2}>
              {values.map((value) => (
                <FadeIn key={value.title}>
                  <div className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors">
                    <div className="text-black mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{value.description}</p>
                  </div>
                </FadeIn>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="section-padding bg-black text-white">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">The vSMPL Manifesto</h2>

              <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-300">
                <p>
                  <strong className="text-white">We reject the myth of endless consumption.</strong> The apparel industry produces 100 billion garments annually. Most are worn less than 10 times. The skateboard market churns out millions of decks that crack and end up in landfills. Jewelry? Mass-produced overseas, designed to tarnish and be replaced.
                </p>

                <p>
                  <strong className="text-white">vSMPL is the antidote.</strong>
                </p>

                <p>
                  Uniformish makes apparel you buy once and wear for decades. Catnip Board Co. turns skateboard decks into collectible art. Bad Arctic crafts jewelry designed to become heirlooms.
                </p>

                <p>
                  <strong className="text-white">Scarcity isn't a marketing tactic—it's a production philosophy.</strong> Limited runs mean every product matters. When it's gone, it's gone. No restocks. No pre-orders. No FOMO manipulation. Just honest scarcity.
                </p>

                <p>
                  <strong className="text-white">This is commerce, reimagined.</strong> Not for everyone. Not for mass appeal. For people who value craft over convenience, scarcity over abundance, and meaning over trends.
                </p>
              </div>

              <div className="mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-black"
                  icon={<ArrowRight />}
                  data-track-id="manifesto-cta"
                >
                  Join the Movement
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container-custom text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay Connected</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Get early access to drops, behind-the-scenes stories, and ecosystem updates. No spam. Just craft.
            </p>
            <div className="flex justify-center">
              <EmailSignup
                variant="light"
                formType="email_signup"
                placeholder="Your email address"
                buttonText="Join Ecosystem"
              />
            </div>
          </FadeIn>
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
                    Manifesto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
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
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} vSMPL Ecosystem. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
