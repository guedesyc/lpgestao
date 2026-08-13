import React from 'react';

export function Select({ label, options = [], placeholder = 'Selecione' }) {
  return React.createElement('label', { style: { display: 'block', fontFamily: 'var(--font-body)', maxWidth: 320 } },
    label && React.createElement('div', { style: { fontSize: 'var(--fs-body-sm)', fontWeight: 600, color: 'var(--text-body)', marginBottom: '6px' } }, label),
    React.createElement('select', {
      style: {
        width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-body-md)',
        padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-default)',
        outline: 'none', background: '#fff', color: 'var(--text-body)', appearance: 'auto',
      },
      defaultValue: '',
    },
      React.createElement('option', { value: '', disabled: true }, placeholder),
      options.map((o, i) => React.createElement('option', { key: i, value: o }, o))
    )
  );
}
