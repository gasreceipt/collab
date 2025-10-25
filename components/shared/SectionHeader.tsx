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
          'section-header',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          className
        )}
      >
        <h2 className="section-title">{title}</h2>
        {subtitle && (
          <p className={clsx(
            'section-subtitle',
            align === 'left' && 'mx-0'
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </FadeIn>
  );
}
