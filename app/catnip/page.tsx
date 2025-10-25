'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/shared/Navigation';
import EmailSignup from '@/components/shared/EmailSignup';
import { getTracker } from '@/lib/tracking';
import { useABTest } from '@/lib/ab-testing';

interface Deck {
  id: string;
  name: string;
  artist: string;
  price: number;
  description: string;
  limited: number;
  width: string;
}

interface Rider {
  name: string;
  location: string;
  quote: string;
}

export default function CatnipPage() {
  const [sessionId, setSessionId] = useState('');
  const tracker = typeof window !== 'undefined' ? getTracker() : null;

  useEffect(() => {
    if (tracker) {
      setSessionId(tracker.getSessionId());
    }
  }, [tracker]);

  // A/B test for hero video autoplay
  const heroVideoVariant = useABTest('catnip_hero_video', sessionId);

  const decks: Deck[] = [
    {
      id: 'catnip-001',
      name: 'Sunset Sessions',
      artist: 'Maya Chen',
      price: 95,
      description: 'Hand-painted sunset gradient. Each one unique. Perfect for street cruising.',
      limited: 40,
      width: '8.25"',
    },
    {
      id: 'catnip-002',
      name: 'Urban Flora',
      artist: 'Javier Ruiz',
      price: 105,
      description: 'Botanical line work meets street art. 7-ply Canadian maple.',
      limited: 35,
      width: '8.5"',
    },
    {
      id: 'catnip-003',
      name: 'Night Shift',
      artist: 'Kenji Tanaka',
      price: 110,
      description: 'Blacklight reactive ink. Glow-in-the-dark details. Limited collab.',
      limited: 25,
      width: '8.0"',
    },
  ];

  const riders: Rider[] = [
    {
      name: 'Alex Rivera',
      location: 'Brooklyn, NY',
      quote: 'Catnip decks feel like art you can ride. The imperfections make it yours.',
    },
    {
      name: 'Sam Wu',
      location: 'Portland, OR',
      quote: "Supporting local artists and riding custom wood? That's the whole vibe.",
    },
  ];

  const handleDeckClick = (deck: Deck) => {
    if (tracker) {
      tracker.trackProductEngagement(deck.id, deck.name, 'click');
    }
  };

  return (
    <div className="min-h-screen bg-catnip-bg text-catnip-text">
      <Navigation variant="light" currentPage="catnip" />

      {/* Hero Section */}
      <section className="section-padding pt-32 hero">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-catnip-accent font-bold mb-4 tracking-wide uppercase text-sm">
                Imperfection = Authenticity
              </p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-black">
                Handmade Skateboard Decks by Local Artists
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Every deck tells a story. Hand-painted, numbered, and crafted with
                intention. No two are exactly alike—that's the point.
              </p>
              <div className="flex gap-4">
                <button
                  className="btn-primary bg-catnip-accent text-white cta"
                  data-track-id="catnip-cta-primary"
                >
                  Browse Decks
                </button>
                <button
                  className="btn-primary border border-catnip-wood text-catnip-wood hover:bg-catnip-warm"
                  data-track-id="catnip-cta-secondary"
                >
                  Custom Orders
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="bg-catnip-warm rounded-lg overflow-hidden">
              {heroVideoVariant === 'variant_a' ? (
                <div className="h-96 flex items-center justify-center bg-gradient-to-br from-catnip-accent to-catnip-wood">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">▶️</div>
                    <p className="text-sm">Auto-playing video</p>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-gradient-to-br from-catnip-accent to-catnip-wood relative group cursor-pointer">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">▶️</div>
                    <p className="text-sm">Click to play</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Handmade Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center text-black">Why Handmade Matters</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3 text-catnip-accent">Artist Collaborations</h3>
              <p className="text-gray-700">
                Every deck design is created by a local artist. They get 20% of sales.
                Art meets function meets community.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🛹</div>
              <h3 className="text-xl font-bold mb-3 text-catnip-accent">Ride Ready</h3>
              <p className="text-gray-700">
                7-ply Canadian maple. Heat-pressed. Concave designed for street
                and park. Art that performs.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-3 text-catnip-accent">Community First</h3>
              <p className="text-gray-700">
                Catnip sponsors local skaters, funds DIY parks, and hosts monthly
                skate jams. More than boards—we're building scenes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deck Showcase */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-4 text-black">Current Collection</h2>
          <p className="text-gray-700 mb-12 text-lg">
            Limited runs. Hand-painted. Ships in 2-3 weeks.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg group cursor-pointer product-card product hover:shadow-2xl transition-all"
                data-track-id={`deck-${deck.id}`}
                onClick={() => handleDeckClick(deck)}
              >
                {/* Deck Image Placeholder */}
                <div className="h-96 bg-gradient-to-br from-catnip-accent/20 to-catnip-warm flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-7xl">🛹</span>
                </div>

                {/* Deck Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-black">{deck.name}</h3>
                      <p className="text-sm text-gray-600">by {deck.artist}</p>
                    </div>
                    <span className="text-catnip-accent font-bold text-lg">${deck.price}</span>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{deck.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Width:</span>
                      <span className="text-gray-900 font-medium">{deck.width}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Limited:</span>
                      <span className="text-catnip-accent font-bold">
                        {deck.limited} decks
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full mt-4 btn-primary bg-catnip-accent text-white hover:bg-catnip-wood cta"
                    data-track-id={`deck-cta-${deck.id}`}
                  >
                    Pre-Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community/Rider Features */}
      <section className="section-padding bg-gradient-to-br from-catnip-accent/10 to-catnip-warm">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center text-black">From the Community</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {riders.map((rider, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-md">
                <p className="text-lg text-gray-800 mb-4 italic">"{rider.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-catnip-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {rider.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-black">{rider.name}</p>
                    <p className="text-sm text-gray-600">{rider.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              className="btn-primary bg-catnip-wood text-white hover:bg-catnip-accent"
              data-track-id="catnip-community-cta"
            >
              Join Our Crew
            </button>
          </div>
        </div>
      </section>

      {/* Customization Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-black">Custom Deck Requests</h2>
            <p className="text-xl text-gray-700 mb-8">
              Want something unique? Commission a one-of-one deck designed just for you.
              Work directly with our artists to create your vision.
            </p>
            <button
              className="btn-primary bg-black text-white hover:bg-gray-800 cta"
              data-track-id="catnip-custom-cta"
            >
              Start Custom Order
            </button>
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4 text-black">Stay in the Loop</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Get notified about new drops, artist features, and skate events.
          </p>
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

      {/* Footer */}
      <footer className="bg-catnip-wood text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Catnip Board Co.</h3>
              <p className="text-sm text-catnip-warm">
                Part of the vSMPL Ecosystem
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-catnip-warm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Current Decks
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Custom Orders
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Past Drops
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-catnip-warm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Featured Riders
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sponsorships
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-catnip-warm">
                <li>
                  <a href="#" className="hover:text-white transition-colors social">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors social">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-catnip-warm/20 text-sm text-catnip-warm text-center">
            © 2024 Catnip Board Co. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
