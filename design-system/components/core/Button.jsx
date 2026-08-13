import React from 'react';

export function Button({ children, variant = 'primary', size = 'md', disabled = false, icon = null, onClick, inverse = false }) {
  const base = {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'default' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { fontSize: 'var(--fs-body-sm)', padding: '8px 14px' },
    md: { fontSize: 'var(--fs-body-md)', padding: '11px 20px' },
    lg: { fontSize: 'var(--fs-body-lg)', padding: '14px 26px' },
  };
  const variants = inverse ? {
    primary: { background: 'var(--white)', color: 'var(--brand-primary)' },
    secondary: { background: 'var(--brand-secondary)', color: 'var(--text-on-brand)' },
    outline: { background: 'transparent', color: 'var(--white)', border: '1.5px solid var(--border-inverse)' },
    ghost: { background: 'transparent', color: 'var(--white)' },
  } : {
    primary: { background: 'var(--brand-primary)', color: 'var(--text-on-brand)' },
    secondary: { background: 'var(--brand-secondary)', color: 'var(--text-on-brand)' },
    outline: { background: 'transparent', color: 'var(--brand-primary)', border: '1.5px solid var(--border-default)' },
    ghost: { background: 'transparent', color: 'var(--brand-primary)' },
  };
  const [hover, setHover] = React.useState(false);
  const hoverBg = inverse ? {
    primary: 'var(--sky-100)',
    secondary: 'var(--teal-600)',
    outline: 'rgba(255,255,255,0.12)',
    ghost: 'rgba(255,255,255,0.12)',
  } : {
    primary: 'var(--lp-navy-950)',
    secondary: 'var(--teal-600)',
    outline: 'var(--surface-sunken)',
    ghost: 'var(--surface-sunken)',
  };
  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    background: hover && !disabled ? hoverBg[variant] : variants[variant].background,
  };
  return React.createElement(
    'button',
    { style, disabled, onClick, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) },
    icon, children
  );
}
