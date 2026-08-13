import React from 'react';
/**
 * @startingPoint section="Forms" subtitle="Checkbox with navy fill state" viewport="700x140"
 */
export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
