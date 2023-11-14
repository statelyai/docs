import React, { ReactNode } from 'react';

export function ButtonLink({
  children,
  background,
  href,
  target,
  rel,
  size,
}: {
  children: ReactNode;
  background: 'blue' | 'pink' | 'darkBlue' | 'orange';
  href: string;
  target: string;
  rel: string;
  size?: 'small' | 'large';
}) {
  // Tailwind does not suppot string interpolation
  const bg =
    background === 'blue'
      ? 'bg-blue-600'
      : background === 'pink'
      ? 'bg-pink-600'
      : background === 'darkBlue'
      ? 'bg-blue-850'
      : background === 'orange'
      ? 'bg-orange-600'
      : 'bg-gray-800';

  const sizeStyles =
    size === 'small'
      ? 'h-8 text-sm px-3'
      : size === 'large'
      ? ' h-16 text-lg px-6'
      : 'h-12 text-md px-4';

  const text = `text-md font-semibold text-gray-50`;
  const layout = 'inline-flex items-center justify-center rounded-full';
  const various =
    'w-fit shadow-md cursor-pointer touch-none select-none transform-gpu transition';
  const disabled = 'disabled:opacity-50 disabled:cursor-not-allowed';
  const hover =
    'hover:before:opacity-50 hover:text-white hover:no-underline before:pointer-events-none before:bg-gradient-to-b before:from-white/[0.12] before:absolute before:inset-0 before:rounded-full before:opacity-0 before:transition-opacity';

  const buttonLinkStyles = classNames(
    bg,
    sizeStyles,
    text,
    layout,
    various,
    disabled,
    hover,
  );

  return (
    <a className={buttonLinkStyles} target={target} rel={rel} href={href}>
      {children}
    </a>
  );
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function ComingSoon() {
  return (
    <div className="text-sm text-white/90 bg-orange-800 font-bold px-4 py-2 w-fit rounded-full select-none">
      Coming soon
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <h2 className="font-extrabold text-3xl md:text-4xl lg:text-5xl drop-shadow-sm text-white/90 leading-tight md:leading-tight lg:leading-tight">
      {children}
    </h2>
  );
}
