'use client';

import dynamic from 'next/dynamic';

const PhosphorIcon = dynamic(
  () => import('./PhosphorIconWrapper').then(mod => mod.PhosphorIcon),
  { ssr: false, loading: () => null }
);

interface IconProps {
  name: string;
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  className?: string;
}

export function Icon({ name, size = 24, weight = 'regular', className = '' }: IconProps) {
  return <PhosphorIcon name={name} size={size} weight={weight} className={className} />;
}

export { PhosphorIcon };
