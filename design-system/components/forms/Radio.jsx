import React from 'react';

export function Radio({ label, name, checked, onChange, disabled = false }) {
  return React.createElement('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-body-md)', color: 'var(--text-body)', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1 } },
    React.createElement('input', { type: 'radio', name, checked, disabled, onChange: () => onChange && onChange(), style: { display: 'none' } }),
    React.createElement('span', {
      style: {
        width: 20, height: 20, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: `1.5px solid ${checked ? 'var(--brand-secondary)' : 'var(--border-default)'}`,
      },
    }, checked && React.createElement('span', { style: { width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-secondary)' } })),
    label
  );
}
