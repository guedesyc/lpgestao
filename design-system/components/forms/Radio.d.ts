import React from 'react';
/**
 * @startingPoint section="Forms" subtitle="Radio button, teal dot when selected" viewport="700x140"
 */
export interface RadioProps {
  label?: React.ReactNode;
  name?: string;
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
}
export function Radio(props: RadioProps): JSX.Element;
