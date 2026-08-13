import React from 'react';

export function Alert({ children, tone = 'info', title }) {
  const tones = {
    info: { bg: 'var(--surface-brand-tint)', fg: 'var(--teal-800)', bar: 'var(--brand-secondary)' },
    success: { bg: '#e5f4ec', fg: '#1f6b41', bar: 'var(--success)' },
    warning: { bg: '#faf0dd', fg: '#8a5f0f', bar: 'var(--warning)' },
    danger: { bg: '#fbeaea', fg: '#8f2a2a', bar: 'var(--danger)' },
  };
  const t = tones[tone];
  return React.createElement('div', {
    style: {
      display: 'flex', gap: '12px', background: t.bg, color: t.fg, borderRadius: 'var(--radius-md)',
      padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-body-md)', lineHeight: 'var(--lh-normal)',
    },
  },
    React.createElement('span', { style: { width: 4, borderRadius: 'var(--radius-full)', background: t.bar, flexShrink: 0 } }),
    React.createElement('div', {},
      title && React.createElement('div', { style: { fontWeight: 700, marginBottom: '2px' } }, title),
      children
    )
  );
}
