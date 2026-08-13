import React from 'react';

/**
 * @startingPoint section="Core" subtitle="Primary, secondary, outline & ghost button" viewport="700x260"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** @default 'primary' */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  /** Use on dark/navy backgrounds (e.g. hero sections) so outline/ghost text stays legible. @default false */
  inverse?: boolean;
}

export function Button(props: ButtonProps): JSX.Element;
