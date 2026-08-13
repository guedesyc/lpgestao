import React from 'react';

export function Card({ children, title, eyebrow, footer, elevated = false }) {
  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)', boxShadow: elevated ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      padding: 'var(--space-6)', fontFamily: 'var(--font-body)',
    },
  },
    eyebrow && React.createElement('div', { style: { fontSize: 'var(--fs-caption)', fontWeight: 600, letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--brand-accent)', marginBottom: '8px' } }, eyebrow),
    title && React.createElement('h3', { style: { fontSize: 'var(--fs-title-md)', color: 'var(--text-body)', marginBottom: '10px' } }, title),
    React.createElement('div', { style: { fontSize: 'var(--fs-body-md)', color: 'var(--text-muted)', lineHeight: 'var(--lh-normal)' } }, children),
    footer && React.createElement('div', { style: { marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' } }, footer)
  );
}
