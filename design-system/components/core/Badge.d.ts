import React from 'react';
/**
 * @startingPoint section="Core" subtitle="Status pill / tag" viewport="700x140"
 */
export interface BadgeProps {
  children: React.ReactNode;
  /** @default 'brand' */
  tone?: 'brand' | 'navy' | 'neutral' | 'success' | 'warning' | 'danger';
}
export function Badge(props: BadgeProps): JSX.Element;
