'use client';

import { createContext, useContext, ReactNode, ComponentType, SVGAttributes } from 'react';

interface IconContextValue {
  color?: string;
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  mirrored?: boolean;
}

const IconContext = createContext<IconContextValue>({
  color: 'currentColor',
  size: 24,
  weight: 'regular',
  mirrored: false,
});

export function useIconContext() {
  return useContext(IconContext);
}

interface IconProviderProps {
  children: ReactNode;
  color?: string;
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
}

export function IconProvider({ children, ...props }: IconProviderProps) {
  return (
    <IconContext.Provider value={props}>
      {children}
    </IconContext.Provider>
  );
}

// Helper to create an icon component wrapper
export function createIconComponent(IconComponent: ComponentType<any>) {
  return function WrappedIcon(props: SVGAttributes<SVGSVGElement>) {
    const context = useIconContext();
    return <IconComponent {...context} {...props} />;
  };
}
