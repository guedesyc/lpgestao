import React from 'react';

export function Checkbox({ label, checked, onChange, disabled = false }) {
  const [on, setOn] = React.useState(!!checked);
  const isOn = checked !== undefined ? checked : on;
  const toggle = () => { if (disabled) return; onChange ? onChange(!isOn) : setOn(!isOn); };
  return React.createElement('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-body-md)', color: 'var(--text-body)', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1 }, onClick: toggle },
    React.createElement('span', {
      style: {
        width: 20, height: 20, borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: `1.5px solid ${isOn ? 'var(--brand-primary)' : 'var(--border-default)'}`,
        background: isOn ? 'var(--brand-primary)' : '#fff',
        transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
      },
    }, isOn && React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: 3 }, React.createElement('path', { d: 'M5 13l4 4L19 7' }))),
    label
  );
}
