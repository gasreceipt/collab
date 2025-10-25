'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScaleOnHover } from '@/components/ui/AnimatedWrappers';
import Button from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/Icons';
import clsx from 'clsx';

interface BrandCardProps {
  name: string;
  tagline: string;
  description: string;
  href: string;
  icon: ReactNode;
  emoji: string;
  accentColor: string;
  textColor: string;
  stats: string[];
  dataTrackId?: string;
}

export default function BrandCard({
  name,
  tagline,
  description,
  href,
  icon,
  emoji,
  accentColor,
  textColor,
  stats,
  dataTrackId,
}: BrandCardProps) {
  return (
    <Link href={href}>
      <ScaleOnHover>
        <motion.div
          className="relative bg-white rounded-2xl overflow-hidden card-shadow group border border-gray-100"
          whileHover={{ y: -4 }}
          data-track-id={dataTrackId}
        >
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Left: Content */}
            <div className="flex flex-col justify-center">
              <div className={clsx('inline-flex mb-4', textColor)}>
                {icon}
              </div>

              <h3 className="text-4xl font-bold mb-2">{name}</h3>

              <p className={clsx('text-lg font-semibold mb-4', textColor)}>
                {tagline}
              </p>

              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {description}
              </p>

              <div className="space-y-2 mb-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className={clsx('mt-1', textColor)}>✓</span>
                    <span className="text-sm text-gray-600">{stat}</span>
                  </div>
                ))}
              </div>

              <div>
                <Button
                  variant="primary"
                  icon={<ArrowRight />}
                  data-track-id={`brand-cta-${name}`}
                >
                  Explore {name}
                </Button>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative h-80 md:h-auto">
              <div className={clsx('absolute inset-0 bg-gradient-to-br rounded-xl', accentColor)}>
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
                    {emoji}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Hover indicator */}
          <div className={clsx(
            'absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500',
            accentColor
          )} />
        </motion.div>
      </ScaleOnHover>
    </Link>
  );
}
