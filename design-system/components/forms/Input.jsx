import React from 'react';

export function Input({ label, placeholder, type = 'text', helpText, error, disabled = false }) {
  const [focused, setFocused] = React.useState(false);
  return React.createElement('label', { style: { display: 'block', fontFamily: 'var(--font-body)', maxWidth: 320 } },
    label && React.createElement('div', { style: { fontSize: 'var(--fs-body-sm)', fontWeight: 600, color: 'var(--text-body)', marginBottom: '6px' } }, label),
    React.createElement('input', {
      type, placeholder, disabled,
      style: {
        width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-body-md)',
        padding: '10px 14px', borderRadius: 'var(--radius-md)',
        border: `1.5px solid ${error ? 'var(--danger)' : focused ? 'var(--brand-secondary)' : 'var(--border-default)'}`,
        outline: 'none', background: disabled ? 'var(--neutral-100)' : '#fff',
        boxShadow: focused ? '0 0 0 3px rgba(54,135,171,0.18)' : 'none',
        transition: 'box-shadow var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)',
      },
      onFocus: () => setFocused(true), onBlur: () => setFocused(false),
    }),
    (helpText || error) && React.createElement('div', { style: { fontSize: 'var(--fs-caption)', marginTop: '5px', color: error ? 'var(--danger)' : 'var(--text-faint)' } }, error || helpText)
  );
}
