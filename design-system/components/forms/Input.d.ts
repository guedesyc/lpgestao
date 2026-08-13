import React from 'react';
/**
 * @startingPoint section="Forms" subtitle="Text field with label, focus ring & error state" viewport="700x180"
 */
export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
}
export function Input(props: InputProps): JSX.Element;
