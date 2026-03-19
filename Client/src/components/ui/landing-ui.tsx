import Link from 'next/link';
import * as React from 'react';

export function AccentDot() {
  return (
    <span className="inline-block w-1.25 h-1.25 rounded-full bg-primary shrink-0" />
  );
}

export function BtnPrimary({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const className =
    'text-[11px] font-bold tracking-[0.12em] uppercase text-primary-foreground bg-primary border-none px-7 py-3.5 cursor-pointer rounded-sm text-center inline-block transition-opacity hover:opacity-90 whitespace-nowrap';
  if (href)
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  return <button className={className}>{children}</button>;
}

export function BtnGhost({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const className =
    'text-[11px] font-bold tracking-[0.12em] uppercase text-foreground bg-transparent border border-border px-7 py-3.25 cursor-pointer rounded-sm text-center inline-block transition-colors hover:bg-muted whitespace-nowrap';
  if (href)
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  return <button className={className}>{children}</button>;
}
