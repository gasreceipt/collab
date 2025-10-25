'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/AnimatedWrappers';
import Button, { ButtonGroup } from '@/components/ui/Button';
import clsx from 'clsx';

interface HeroButton {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: ReactNode;
  onClick?: () => void;
  dataTrackId?: string;
}

interface HeroProps {
  badge?: {
    icon?: ReactNode;
    text: string;
  };
  title: string | ReactNode;
  subtitle: string | ReactNode;
  buttons?: HeroButton[];
  variant?: 'light' | 'dark' | 'gradient';
  backgroundGradient?: string;
  className?: string;
}

export default function Hero({
  badge,
  title,
  subtitle,
  buttons = [],
  variant = 'light',
  backgroundGradient = 'from-blue-50 via-orange-50 to-gray-100',
  className = '',
}: HeroProps) {
  const isDark = variant === 'dark';
  const hasGradient = variant === 'gradient';

  return (
    <section
      className={clsx(
        'relative section-padding pt-32 overflow-hidden',
        isDark && 'bg-black text-white',
        className
      )}
    >
      {/* Background */}
      {hasGradient && (
        <div className="absolute inset-0 -z-10">
          <motion.div
            className={clsx('absolute inset-0 bg-gradient-to-br', backgroundGradient)}
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
      )}

      <div className="container-custom text-center relative z-10">
        {/* Badge */}
        {badge && (
          <FadeIn delay={0.1}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="inline-block mb-6"
            >
              <div
                className={clsx(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full border',
                  isDark
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-black/5 border-black/10 text-black'
                )}
              >
                {badge.icon && <span className="w-4 h-4">{badge.icon}</span>}
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            </motion.div>
          </FadeIn>
        )}

        {/* Title */}
        <FadeIn delay={0.2}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-none">
            {title}
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.3}>
          <div
            className={clsx(
              'text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}
          >
            {subtitle}
          </div>
        </FadeIn>

        {/* Buttons */}
        {buttons.length > 0 && (
          <FadeIn delay={0.4}>
            <ButtonGroup className="justify-center">
              {buttons.map((button, idx) => (
                <Button
                  key={idx}
                  variant={button.variant || 'primary'}
                  size="lg"
                  icon={button.icon}
                  onClick={button.onClick}
                  data-track-id={button.dataTrackId}
                  className={isDark && button.variant === 'outline' ? 'border-white text-white hover:bg-white hover:text-black' : ''}
                >
                  {button.label}
                </Button>
              ))}
            </ButtonGroup>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
