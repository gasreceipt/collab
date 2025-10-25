'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';
import { getTracker } from '@/lib/tracking';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  brand: 'uniformish' | 'catnip' | 'bad-arctic';
  badge?: string;
  limited?: number;
  metadata?: { label: string; value: string }[];
  gradient?: string;
  onClick?: () => void;
}

export default function ProductCard({
  id,
  name,
  price,
  description,
  brand,
  badge,
  limited,
  metadata = [],
  gradient = 'from-gray-100 to-gray-200',
  onClick,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const brandColors = {
    uniformish: {
      accent: 'text-uniformish-accent',
      bg: 'from-uniformish-accent/10 to-uniformish-accent/5',
      border: 'border-uniformish-accent',
    },
    catnip: {
      accent: 'text-catnip-accent',
      bg: 'from-catnip-accent/10 to-catnip-warm',
      border: 'border-catnip-accent',
    },
    'bad-arctic': {
      accent: 'text-badArctic-accent',
      bg: 'from-badArctic-platinum to-badArctic-ice',
      border: 'border-badArctic-accent',
    },
  };

  const colors = brandColors[brand];

  const handleClick = () => {
    const tracker = getTracker();
    tracker.trackProductEngagement(id, name, 'click');
    onClick?.();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    const tracker = getTracker();
    tracker.trackProductEngagement(id, name, isLiked ? 'view' : 'add_to_waitlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
      data-track-id={`product-${id}`}
    >
      {/* Badge */}
      {badge && (
        <div className={clsx(
          'absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg',
          colors.bg
        )}>
          <span className={colors.accent}>{badge}</span>
        </div>
      )}

      {/* Like Button */}
      <motion.button
        onClick={handleLike}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
        whileTap={{ scale: 0.9 }}
      >
        <motion.svg
          className={clsx('w-5 h-5', isLiked ? 'fill-red-500' : 'fill-none stroke-gray-400')}
          viewBox="0 0 24 24"
          strokeWidth={2}
          animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </motion.svg>
      </motion.button>

      {/* Product Image */}
      <div className={clsx(
        'relative h-80 bg-gradient-to-br overflow-hidden',
        gradient
      )}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Placeholder - Replace with actual product image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.4 }}
            className="text-8xl"
          >
            {brand === 'uniformish' && '👕'}
            {brand === 'catnip' && '🛹'}
            {brand === 'bad-arctic' && '💍'}
          </motion.div>
        </div>

        {/* Quick View Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <button
            className={clsx(
              'w-full py-3 px-6 rounded-lg font-semibold text-white shadow-lg transition-all',
              colors.bg,
              colors.border,
              'border-2'
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Quick View
          </button>
        </motion.div>
      </div>

      {/* Product Details */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors">
            {name}
          </h3>
          <span className={clsx('text-lg font-bold', colors.accent)}>
            ${price}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Metadata */}
        {metadata.length > 0 && (
          <div className="space-y-1 mb-4">
            {metadata.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-500">{item.label}:</span>
                <span className="text-gray-700 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Limited Edition */}
        {limited && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min((limited / 100) * 100, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className={clsx('h-full bg-gradient-to-r', colors.bg)}
              />
            </div>
            <span className={clsx('text-xs font-bold', colors.accent)}>
              Only {limited} left
            </span>
          </div>
        )}

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={clsx(
            'w-full py-3 rounded-lg font-semibold transition-all duration-200',
            'bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md'
          )}
          data-track-id={`product-cta-${id}`}
        >
          Add to Waitlist
        </motion.button>
      </div>
    </motion.div>
  );
}
