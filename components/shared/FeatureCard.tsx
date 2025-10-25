'use client';

import { ReactNode } from 'react';
import { FadeIn } from '@/components/ui/AnimatedWrappers';
import clsx from 'clsx';

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  variant?: 'default' | 'bordered' | 'elevated';
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  variant = 'default',
  className = '',
}: FeatureCardProps) {
  const variants = {
    default: 'bg-gray-50 hover:bg-gray-100',
    bordered: 'border-2 border-gray-200 hover:border-gray-300 bg-white',
    elevated: 'bg-white shadow-md hover:shadow-xl',
  };

  return (
    <FadeIn>
      <div
        className={clsx(
          'rounded-xl p-8 transition-all duration-300',
          variants[variant],
          className
        )}
      >
        {icon && <div className="text-black mb-4">{icon}</div>}
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
    </FadeIn>
  );
}
