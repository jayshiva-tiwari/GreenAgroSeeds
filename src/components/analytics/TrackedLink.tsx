'use client';

import { trackEvent } from '@/lib/analytics';
import { Link } from '@/i18n/routing';
import { ReactNode } from 'react';

interface TrackedLinkProps {
  href: string;
  eventType: string;
  productId?: string;
  metadata?: any;
  className?: string;
  children: ReactNode;
  asAnchor?: boolean;
}

export default function TrackedLink({ 
    href, 
    eventType, 
    productId, 
    metadata, 
    className, 
    children,
    asAnchor = false
}: TrackedLinkProps) {
  
  const handleClick = () => {
    trackEvent(eventType as any, productId, metadata);
  };

  if (asAnchor || href.startsWith('http')) {
      return (
        <a 
          href={href} 
          onClick={handleClick} 
          className={className}
          target={href.startsWith('http') ? "_blank" : undefined}
          rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
  }

  return (
    <Link href={href as any} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
