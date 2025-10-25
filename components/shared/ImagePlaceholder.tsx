'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ImagePlaceholderProps {
  emoji?: string;
  gradient?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export default function ImagePlaceholder({
  emoji = '📦',
  gradient = 'from-gray-100 to-gray-200',
  size = 'md',
  animated = true,
  className = '',
}: ImagePlaceholderProps) {
  const sizes = {
    sm: 'h-40',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
  };

  const emojiSizes = {
    sm: 'text-5xl',
    md: 'text-7xl',
    lg: 'text-8xl',
    xl: 'text-9xl',
  };

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-lg bg-gradient-to-br',
        sizes[size],
        gradient,
        className
      )}
    >
      {/* Animated overlay */}
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Emoji/Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        {animated ? (
          <motion.div
            className={clsx(emojiSizes[size], 'opacity-40')}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {emoji}
          </motion.div>
        ) : (
          <div className={clsx(emojiSizes[size], 'opacity-40')}>{emoji}</div>
        )}
      </div>
    </div>
  );
}
