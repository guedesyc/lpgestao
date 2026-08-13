import React from 'react';
/**
 * @startingPoint section="Feedback" subtitle="Inline callout/alert banner" viewport="700x200"
 */
export interface AlertProps {
  children: React.ReactNode;
  title?: string;
  /** @default 'info' */
  tone?: 'info' | 'success' | 'warning' | 'danger';
}
export function Alert(props: AlertProps): JSX.Element;
