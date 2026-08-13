/* @ds-bundle: {"format":4,"namespace":"GrupoLemosPassosDesignSystem_e340d6","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"1f1cbf29a35a","components/core/Button.jsx":"6fdb3cc9d7ca","components/core/Card.jsx":"39fa06795544","components/feedback/Alert.jsx":"15527bddfdc7","components/forms/Checkbox.jsx":"0149954ae50c","components/forms/Input.jsx":"68fb598c45db","components/forms/Radio.jsx":"c695debc8d1c","components/forms/Select.jsx":"5ab2ee8bdb82","components/navigation/Navbar.jsx":"d4b70ec13d78"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GrupoLemosPassosDesignSystem_e340d6 = window.GrupoLemosPassosDesignSystem_e340d6 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function Badge({
  children,
  tone = 'brand'
}) {
  const tones = {
    brand: {
      background: 'var(--surface-brand-tint)',
      color: 'var(--teal-800)'
    },
    navy: {
      background: 'var(--brand-primary)',
      color: '#fff'
    },
    neutral: {
      background: 'var(--neutral-100)',
      color: 'var(--text-muted)'
    },
    success: {
      background: '#e5f4ec',
      color: 'var(--success)'
    },
    warning: {
      background: '#faf0dd',
      color: 'var(--warning)'
    },
    danger: {
      background: '#fbeaea',
      color: 'var(--danger)'
    }
  };
  return React.createElement('span', {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)',
      display: 'inline-block',
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  onClick,
  inverse = false
}) {
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
    opacity: disabled ? 0.5 : 1
  };
  const sizes = {
    sm: {
      fontSize: 'var(--fs-body-sm)',
      padding: '8px 14px'
    },
    md: {
      fontSize: 'var(--fs-body-md)',
      padding: '11px 20px'
    },
    lg: {
      fontSize: 'var(--fs-body-lg)',
      padding: '14px 26px'
    }
  };
  const variants = inverse ? {
    primary: {
      background: 'var(--white)',
      color: 'var(--brand-primary)'
    },
    secondary: {
      background: 'var(--brand-secondary)',
      color: 'var(--text-on-brand)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--white)',
      border: '1.5px solid var(--border-inverse)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--white)'
    }
  } : {
    primary: {
      background: 'var(--brand-primary)',
      color: 'var(--text-on-brand)'
    },
    secondary: {
      background: 'var(--brand-secondary)',
      color: 'var(--text-on-brand)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--brand-primary)',
      border: '1.5px solid var(--border-default)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--brand-primary)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverBg = inverse ? {
    primary: 'var(--sky-100)',
    secondary: 'var(--teal-600)',
    outline: 'rgba(255,255,255,0.12)',
    ghost: 'rgba(255,255,255,0.12)'
  } : {
    primary: 'var(--lp-navy-950)',
    secondary: 'var(--teal-600)',
    outline: 'var(--surface-sunken)',
    ghost: 'var(--surface-sunken)'
  };
  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    background: hover && !disabled ? hoverBg[variant] : variants[variant].background
  };
  return React.createElement('button', {
    style,
    disabled,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  title,
  eyebrow,
  footer,
  elevated = false
}) {
  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      boxShadow: elevated ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      padding: 'var(--space-6)',
      fontFamily: 'var(--font-body)'
    }
  }, eyebrow && React.createElement('div', {
    style: {
      fontSize: 'var(--fs-caption)',
      fontWeight: 600,
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--brand-accent)',
      marginBottom: '8px'
    }
  }, eyebrow), title && React.createElement('h3', {
    style: {
      fontSize: 'var(--fs-title-md)',
      color: 'var(--text-body)',
      marginBottom: '10px'
    }
  }, title), React.createElement('div', {
    style: {
      fontSize: 'var(--fs-body-md)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--lh-normal)'
    }
  }, children), footer && React.createElement('div', {
    style: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function Alert({
  children,
  tone = 'info',
  title
}) {
  const tones = {
    info: {
      bg: 'var(--surface-brand-tint)',
      fg: 'var(--teal-800)',
      bar: 'var(--brand-secondary)'
    },
    success: {
      bg: '#e5f4ec',
      fg: '#1f6b41',
      bar: 'var(--success)'
    },
    warning: {
      bg: '#faf0dd',
      fg: '#8a5f0f',
      bar: 'var(--warning)'
    },
    danger: {
      bg: '#fbeaea',
      fg: '#8f2a2a',
      bar: 'var(--danger)'
    }
  };
  const t = tones[tone];
  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: '12px',
      background: t.bg,
      color: t.fg,
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-md)',
      lineHeight: 'var(--lh-normal)'
    }
  }, React.createElement('span', {
    style: {
      width: 4,
      borderRadius: 'var(--radius-full)',
      background: t.bar,
      flexShrink: 0
    }
  }), React.createElement('div', {}, title && React.createElement('div', {
    style: {
      fontWeight: 700,
      marginBottom: '2px'
    }
  }, title), children));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  disabled = false
}) {
  const [on, setOn] = React.useState(!!checked);
  const isOn = checked !== undefined ? checked : on;
  const toggle = () => {
    if (disabled) return;
    onChange ? onChange(!isOn) : setOn(!isOn);
  };
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-md)',
      color: 'var(--text-body)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1
    },
    onClick: toggle
  }, React.createElement('span', {
    style: {
      width: 20,
      height: 20,
      borderRadius: '6px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1.5px solid ${isOn ? 'var(--brand-primary)' : 'var(--border-default)'}`,
      background: isOn ? 'var(--brand-primary)' : '#fff',
      transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)'
    }
  }, isOn && React.createElement('svg', {
    width: 12,
    height: 12,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'white',
    strokeWidth: 3
  }, React.createElement('path', {
    d: 'M5 13l4 4L19 7'
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  type = 'text',
  helpText,
  error,
  disabled = false
}) {
  const [focused, setFocused] = React.useState(false);
  return React.createElement('label', {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      maxWidth: 320
    }
  }, label && React.createElement('div', {
    style: {
      fontSize: 'var(--fs-body-sm)',
      fontWeight: 600,
      color: 'var(--text-body)',
      marginBottom: '6px'
    }
  }, label), React.createElement('input', {
    type,
    placeholder,
    disabled,
    style: {
      width: '100%',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-md)',
      padding: '10px 14px',
      borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${error ? 'var(--danger)' : focused ? 'var(--brand-secondary)' : 'var(--border-default)'}`,
      outline: 'none',
      background: disabled ? 'var(--neutral-100)' : '#fff',
      boxShadow: focused ? '0 0 0 3px rgba(54,135,171,0.18)' : 'none',
      transition: 'box-shadow var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)'
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }), (helpText || error) && React.createElement('div', {
    style: {
      fontSize: 'var(--fs-caption)',
      marginTop: '5px',
      color: error ? 'var(--danger)' : 'var(--text-faint)'
    }
  }, error || helpText));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  name,
  checked,
  onChange,
  disabled = false
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-md)',
      color: 'var(--text-body)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, React.createElement('input', {
    type: 'radio',
    name,
    checked,
    disabled,
    onChange: () => onChange && onChange(),
    style: {
      display: 'none'
    }
  }), React.createElement('span', {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1.5px solid ${checked ? 'var(--brand-secondary)' : 'var(--border-default)'}`
    }
  }, checked && React.createElement('span', {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--brand-secondary)'
    }
  })), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  placeholder = 'Selecione'
}) {
  return React.createElement('label', {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      maxWidth: 320
    }
  }, label && React.createElement('div', {
    style: {
      fontSize: 'var(--fs-body-sm)',
      fontWeight: 600,
      color: 'var(--text-body)',
      marginBottom: '6px'
    }
  }, label), React.createElement('select', {
    style: {
      width: '100%',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-md)',
      padding: '10px 14px',
      borderRadius: 'var(--radius-md)',
      border: '1.5px solid var(--border-default)',
      outline: 'none',
      background: '#fff',
      color: 'var(--text-body)',
      appearance: 'auto'
    },
    defaultValue: ''
  }, React.createElement('option', {
    value: '',
    disabled: true
  }, placeholder), options.map((o, i) => React.createElement('option', {
    key: i,
    value: o
  }, o))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
function Navbar({
  items = [],
  active = 0
}) {
  return React.createElement('nav', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      background: 'var(--surface-inverse)',
      fontFamily: 'var(--font-display)'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#fff',
      fontWeight: 700,
      fontSize: 'var(--fs-title-sm)'
    }
  }, React.createElement('span', {
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: 'var(--brand-secondary)',
      display: 'inline-block'
    }
  }), 'grupo lemospassos'), React.createElement('div', {
    style: {
      display: 'flex',
      gap: '28px'
    }
  }, items.map((it, i) => React.createElement('span', {
    key: i,
    style: {
      color: i === active ? '#fff' : 'var(--sky-200)',
      fontWeight: i === active ? 700 : 500,
      fontSize: 'var(--fs-body-md)',
      cursor: 'pointer',
      borderBottom: i === active ? '2px solid var(--brand-secondary)' : '2px solid transparent',
      paddingBottom: '4px'
    }
  }, it))));
}
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Navbar = __ds_scope.Navbar;

})();
