import React from 'react';

export function Navbar({ items = [], active = 0 }) {
  return React.createElement('nav', {
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 32px', background: 'var(--surface-inverse)', fontFamily: 'var(--font-display)',
    },
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: 700, fontSize: 'var(--fs-title-sm)' } },
      React.createElement('span', { style: { width: 30, height: 30, borderRadius: '50%', background: 'var(--brand-secondary)', display: 'inline-block' } }),
      'grupo lemospassos'
    ),
    React.createElement('div', { style: { display: 'flex', gap: '28px' } },
      items.map((it, i) => React.createElement('span', {
        key: i,
        style: { color: i === active ? '#fff' : 'var(--sky-200)', fontWeight: i === active ? 700 : 500, fontSize: 'var(--fs-body-md)', cursor: 'pointer', borderBottom: i === active ? '2px solid var(--brand-secondary)' : '2px solid transparent', paddingBottom: '4px' },
      }, it))
    )
  );
}
