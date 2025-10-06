'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ThemedImageProps {
  alt: string;
  sources: {
    light: string;
    dark: string;
  };
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function ThemedImage({
  alt,
  sources,
  width,
  height,
  className,
  priority = false,
}: ThemedImageProps) {
  const { theme, resolvedTheme } = useTheme();

  return (
    <img
      src={sources.light}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
