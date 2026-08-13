import React from 'react';
/**
 * @startingPoint section="Core" subtitle="Content container with eyebrow, title, footer" viewport="700x260"
 */
export interface CardProps {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  footer?: React.ReactNode;
  elevated?: boolean;
}
export function Card(props: CardProps): JSX.Element;
