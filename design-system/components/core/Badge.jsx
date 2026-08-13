import React from 'react';

export function Badge({ children, tone = 'brand' }) {
  const tones = {
    brand: { background: 'var(--surface-brand-tint)', color: 'var(--teal-800)' },
    navy: { background: 'var(--brand-primary)', color: '#fff' },
    neutral: { background: 'var(--neutral-100)', color: 'var(--text-muted)' },
    success: { background: '#e5f4ec', color: 'var(--success)' },
    warning: { background: '#faf0dd', color: 'var(--warning)' },
    danger: { background: '#fbeaea', color: 'var(--danger)' },
  };
  return React.createElement('span', {
    style: {
      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
      padding: '4px 10px', borderRadius: 'var(--radius-full)', display: 'inline-block',
      ...tones[tone],
    },
  }, children);
}
