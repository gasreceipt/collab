'use client';

import { FadeIn } from '@/components/ui/AnimatedWrappers';
import clsx from 'clsx';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  return (
    <FadeIn>
      <div
        className={clsx(
          'mb-16',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          className
        )}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
        {subtitle && (
          <p className={clsx(
            'text-xl text-gray-600',
            align === 'center' && 'max-w-3xl mx-auto',
            align === 'left' && 'max-w-3xl'
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </FadeIn>
  );
}
