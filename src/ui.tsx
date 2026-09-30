import React, { useState, useRef, useEffect } from 'react';

// ─── Color tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg: '#fafaf8',
  surface: '#ffffff',
  border: '#e6e1db',
  borderStrong: '#c8c3bc',
  text: '#1a1714',
  textSec: '#5c5751',
  textMuted: '#9e9890',
  brand: '#b8724a',
  brandLight: '#f5e8de',
  brandDark: '#8b5236',
  success: '#166534',
  successBg: '#f0fdf4',
  successBorder: '#86efac',
  warning: '#92400e',
  warningBg: '#fffbeb',
  warningBorder: '#fcd34d',
  error: '#991b1b',
  errorBg: '#fef2f2',
  errorBorder: '#fca5a5',
  info: '#1e40af',
  infoBg: '#eff6ff',
  infoBorder: '#93c5fd',
};

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

export function Button({
  children, variant = 'primary', size = 'md', fullWidth = false,
  disabled = false, loading = false, icon, iconRight, onClick,
  type = 'button', className = '',
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none';

  const variants = {
    primary: 'bg-[#1a1714] text-white hover:bg-[#2e2a26] active:bg-[#3d3930] focus-visible:ring-[#1a1714] disabled:bg-[#9e9890] disabled:cursor-not-allowed',
    secondary: 'bg-[#b8724a] text-white hover:bg-[#9b5c38] active:bg-[#7a4529] focus-visible:ring-[#b8724a] disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border border-[#1a1714] text-[#1a1714] hover:bg-[#f5f3ef] active:bg-[#ece9e2] focus-visible:ring-[#1a1714] disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-[#5c5751] hover:bg-[#f5f3ef] active:bg-[#ece9e2] focus-visible:ring-[#9e9890] disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-[#991b1b] text-white hover:bg-[#7f1d1d] active:bg-[#6b1a1a] focus-visible:ring-[#991b1b] disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizes = {
    xs: 'text-xs px-3 py-1.5 h-7',
    sm: 'text-sm px-3.5 py-2 h-8',
    md: 'text-sm px-5 py-2.5 h-10',
    lg: 'text-base px-6 py-3 h-12',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? <Spinner size={size === 'lg' ? 18 : 15} color={variant === 'ghost' ? '#5c5751' : 'white'} /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

// ─── Icon Button ──────────────────────────────────────────────────────────────
interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  className?: string;
}

export function IconButton({ icon, label, onClick, variant = 'ghost', size = 'md', active = false, className = '' }: IconButtonProps) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const variants = {
    ghost: `text-[#5c5751] hover:bg-[#f5f3ef] active:bg-[#ece9e2] ${active ? 'bg-[#f5f3ef] text-[#1a1714]' : ''}`,
    outline: `border border-[#e6e1db] text-[#5c5751] hover:bg-[#f5f3ef] ${active ? 'border-[#1a1714] bg-[#f5f3ef]' : ''}`,
  };
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`${sizes[size]} ${variants[variant]} inline-flex items-center justify-center rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] ${className}`}
    >
      {icon}
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', dot = false, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[#f5f3ef] text-[#5c5751] border-[#e6e1db]',
    neutral: 'bg-[#f5f3ef] text-[#5c5751] border-[#e6e1db]',
    success: 'bg-[#f0fdf4] text-[#166534] border-[#86efac]',
    warning: 'bg-[#fffbeb] text-[#92400e] border-[#fcd34d]',
    error: 'bg-[#fef2f2] text-[#991b1b] border-[#fca5a5]',
    info: 'bg-[#eff6ff] text-[#1e40af] border-[#93c5fd]',
    brand: 'bg-[#f5e8de] text-[#8b5236] border-[#e4c5aa]',
  };
  const dotColors = {
    default: '#9e9890', neutral: '#9e9890', success: '#16a34a', warning: '#d97706', error: '#dc2626', info: '#2563eb', brand: '#b8724a',
  };
  const sizes = {
    sm: `text-xs px-2 py-0.5 font-medium`,
    md: `text-xs px-2.5 py-1 font-medium`,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span style={{ backgroundColor: dotColors[variant] }} className="w-1.5 h-1.5 rounded-full flex-shrink-0" />}
      {children}
    </span>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function Input({ label, placeholder, value, onChange, type = 'text', error, hint, icon, iconRight, disabled, required, className = '' }: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[#1a1714]">
          {label}{required && <span className="text-[#b8724a] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9890]">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full h-10 px-3 ${icon ? 'pl-9' : ''} ${iconRight ? 'pr-9' : ''} text-sm border rounded-lg bg-white text-[#1a1714] placeholder-[#c5c0b5] transition-colors
            ${error ? 'border-[#fca5a5] focus:border-[#991b1b] focus:ring-1 focus:ring-[#fca5a5]' : 'border-[#e6e1db] focus:border-[#b8724a] focus:ring-1 focus:ring-[#f5e8de]'}
            ${disabled ? 'bg-[#f5f3ef] text-[#9e9890] cursor-not-allowed' : ''}
            outline-none`}
        />
        {iconRight && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9890]">{iconRight}</span>}
      </div>
      {error && (
        <p className="text-xs text-[#991b1b] flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1L11 10H1L6 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M6 5V7M6 8.5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-[#9e9890]">{hint}</p>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  rows?: number;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function Textarea({ label, placeholder, value, onChange, rows = 4, error, hint, disabled, required, className = '' }: TextareaProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-[#1a1714]">{label}{required && <span className="text-[#b8724a] ml-0.5">*</span>}</label>}
      <textarea
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-[#1a1714] placeholder-[#c5c0b5] resize-none transition-colors
          ${error ? 'border-[#fca5a5] focus:border-[#991b1b]' : 'border-[#e6e1db] focus:border-[#b8724a] focus:ring-1 focus:ring-[#f5e8de]'}
          ${disabled ? 'bg-[#f5f3ef] text-[#9e9890] cursor-not-allowed' : ''}
          outline-none`}
      />
      {error && <p className="text-xs text-[#991b1b]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9e9890]">{hint}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function Select({ label, value, onChange, options, placeholder, error, disabled, required, className = '' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && <label className="text-sm font-medium text-[#1a1714]">{label}{required && <span className="text-[#b8724a] ml-0.5">*</span>}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full h-10 px-3 pr-9 text-sm text-left border rounded-lg bg-white transition-colors
            ${error ? 'border-[#fca5a5]' : 'border-[#e6e1db] focus:border-[#b8724a] focus:ring-1 focus:ring-[#f5e8de]'}
            ${disabled ? 'bg-[#f5f3ef] text-[#9e9890] cursor-not-allowed' : 'text-[#1a1714]'}
            outline-none`}
        >
          <span className="block truncate">{selectedOption ? selectedOption.label : (placeholder || '')}</span>
          <svg className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9e9890] transition-transform ${isOpen ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#e6e1db] rounded-lg shadow-lg max-h-60 overflow-auto py-1">
            {placeholder && (
              <div 
                className="px-3 py-2 text-sm text-[#9e9890] cursor-pointer hover:bg-[#f5f3ef]"
                onClick={() => { onChange?.(''); setIsOpen(false); }}
              >
                {placeholder}
              </div>
            )}
            {options.map(o => (
              <div 
                key={o.value} 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${value === o.value ? 'bg-[#f5e8de] text-[#b8724a] font-medium' : 'text-[#1a1714] hover:bg-[#f5f3ef]'}`}
                onClick={() => { onChange?.(o.value); setIsOpen(false); }}
              >
                {o.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#991b1b]">{error}</p>}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
}

export function Toggle({ checked, onChange, label, size = 'md' }: ToggleProps) {
  const track = size === 'sm' ? 'w-8 h-4' : 'w-10 h-6';
  const thumb = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const thumbX = size === 'sm' ? (checked ? '18px' : '2px') : (checked ? '22px' : '2px');
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`${track} relative rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8724a] focus-visible:ring-offset-2`}
        style={{ backgroundColor: checked ? '#1a1714' : '#dddad1' }}
      >
        <span
          className={`${thumb} absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all duration-200`}
          style={{ left: thumbX }}
        />
      </button>
      {label && <span className="text-sm text-[#1a1714]">{label}</span>}
    </label>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────
interface CheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2.5 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0
          ${checked ? 'bg-[#1a1714] border-[#1a1714]' : 'border-[#c5c0b5] bg-white hover:border-[#9e9890]'}`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {label && <span className="text-sm text-[#1a1714]">{label}</span>}
    </label>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', onClick, hover = false, padding = 'md' }: CardProps) {
  const pads = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#e6e1db] rounded-xl ${pads[padding]}
        ${hover ? 'hover:border-[#c8c3bc] hover:shadow-sm transition-all duration-200 cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  alert?: boolean;
}

export function StatCard({ label, value, delta, deltaPositive = true, icon, onClick, alert = false }: StatCardProps) {
  return (
    <Card hover={!!onClick} onClick={onClick} className={alert ? 'border-[#fca5a5]' : ''}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#5c5751] font-medium">{label}</p>
          <p className="text-2xl font-bold text-[#1a1714] mt-1 tabular-nums">{value}</p>
          {delta && (
            <p className={`text-xs mt-1 font-medium flex items-center gap-0.5 ${deltaPositive ? 'text-[#166534]' : 'text-[#991b1b]'}`}>
              {deltaPositive ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M5 8V2M2 5L5 2L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M5 2V8M2 5L5 8L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {delta}
            </p>
          )}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${alert ? 'bg-[#fef2f2] text-[#991b1b]' : 'bg-[#f5f3ef] text-[#5c5751]'}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (v: number) => void;
}

export function StarRating({ rating, max = 5, size = 14, showValue = false, interactive = false, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = interactive ? (hover || rating) > i : rating > i;
        const partial = !interactive && rating > i && rating < i + 1 ? (rating - i) * 100 : 0;
        return (
          <svg
            key={i}
            width={size} height={size}
            viewBox="0 0 16 16"
            className={interactive ? 'cursor-pointer' : ''}
            onMouseEnter={() => interactive && setHover(i + 1)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onChange?.(i + 1)}
          >
            {partial > 0 && (
              <defs>
                <linearGradient id={`star-${i}`}>
                  <stop offset={`${partial}%`} stopColor="#b8724a" />
                  <stop offset={`${partial}%`} stopColor="#e6e1db" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M8 1.5L9.854 5.646L14.5 6.382L11.25 9.354L12.09 14L8 11.772L3.91 14L4.75 9.354L1.5 6.382L6.146 5.646L8 1.5Z"
              fill={partial > 0 ? `url(#star-${i})` : filled ? '#b8724a' : '#e6e1db'}
              stroke={filled || partial > 0 ? '#b8724a' : '#c8c3bc'}
              strokeWidth="0.5"
            />
          </svg>
        );
      })}
      {showValue && <span className="text-xs font-semibold text-[#5c5751] ml-0.5">{rating.toFixed(1)}</span>}
    </span>
  );
}

// ─── Alert ────────────────────────────────────────────────────────────────────
interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  className?: string;
}

export function Alert({ children, variant = 'info', title, className = '' }: AlertProps) {
  const styles = {
    info: { bg: '#eff6ff', border: '#93c5fd', text: '#1e40af', iconColor: '#2563eb' },
    success: { bg: '#f0fdf4', border: '#86efac', text: '#166534', iconColor: '#16a34a' },
    warning: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', iconColor: '#d97706' },
    error: { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', iconColor: '#dc2626' },
  };
  const s = styles[variant];
  const icons = {
    info: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5V5.5M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    success: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    warning: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 6V9M8 10.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    error: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  };
  return (
    <div
      className={`flex gap-3 p-4 rounded-lg border ${className}`}
      style={{ backgroundColor: s.bg, borderColor: s.border, color: s.text }}
      role="alert"
    >
      <span className="flex-shrink-0 mt-0.5" style={{ color: s.iconColor }}>{icons[variant]}</span>
      <div className="min-w-0">
        {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, color = '#b8724a' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.25" strokeWidth="3"/>
      <path d="M12 2C6.477 2 2 6.477 2 12" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-[#ece9e2] rounded-lg animate-pulse ${className}`} />;
}

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#f5f3ef] text-[#9e9890] flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#1a1714] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#5c5751] max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover flex-shrink-0`} />;
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-[#f5e8de] text-[#b8724a] font-semibold flex items-center justify-center flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  className?: string;
}

export function Table({ headers, rows, className = '' }: TableProps) {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-[#e6e1db] ${className}`}>
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="border-b border-[#e6e1db] bg-[#f5f3ef]">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-3 text-xs font-semibold text-[#5c5751] uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e6e1db] bg-white">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-[#fafaf8] transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-[#1a1714]">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  const maxW = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white w-full ${maxW[size]} rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-xl`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6e1db] flex-shrink-0">
            <h2 className="text-base font-semibold text-[#1a1714]">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9e9890] hover:bg-[#f5f3ef] hover:text-[#1a1714] transition-colors" aria-label="Close">
              <Icons.Close />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-[#e6e1db] flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  footer?: React.ReactNode;
}

export function Drawer({ open, onClose, title, children, position = 'right', footer }: DrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute top-0 ${position === 'right' ? 'right-0' : 'left-0'} h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full'}`}>
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e6e1db] flex-shrink-0">
            <h2 className="text-base font-semibold text-[#1a1714]">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9e9890] hover:bg-[#f5f3ef] transition-colors" aria-label="Close">
              <Icons.Close />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-[#e6e1db] flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

export function ProgressBar({ value, max = 100, color = '#b8724a', size = 'sm', label, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div className={className}>
      {label && <p className="text-xs text-[#5c5751] mb-1">{label}</p>}
      <div className={`w-full ${h} bg-[#ece9e2] rounded-full overflow-hidden`} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
        <div className={`${h} rounded-full transition-all duration-500`} style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex border-b border-[#e6e1db] overflow-x-auto ${className}`} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0
            ${active === tab.id ? 'border-[#1a1714] text-[#1a1714]' : 'border-transparent text-[#9e9890] hover:text-[#5c5751]'}`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${active === tab.id ? 'bg-[#f5f3ef] text-[#5c5751]' : 'bg-[#f5f3ef] text-[#9e9890]'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: { bg: '#1a1714', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#4ade80" strokeWidth="1.5"/><path d="M5 8L7 10L11 6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    error: { bg: '#991b1b', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#fca5a5" strokeWidth="1.5"/><path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    warning: { bg: '#92400e', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14.5 13H1.5L8 2Z" stroke="#fcd34d" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 6V9M8 10.5V11" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    info: { bg: '#1e40af', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#93c5fd" strokeWidth="1.5"/><path d="M8 5V5.5M8 7V11" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  };
  const s = styles[type];
  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-xl max-w-[calc(100vw-2rem)]"
      style={{ backgroundColor: s.bg }}
      role="status"
      aria-live="polite"
    >
      {s.icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0" aria-label="Dismiss">
        <Icons.Close />
      </button>
    </div>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
              ${i < current ? 'bg-[#1a1714] text-white' : i === current ? 'bg-[#b8724a] text-white' : 'bg-[#ece9e2] text-[#9e9890]'}`}>
              {i < current ? (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (i + 1)}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${i === current ? 'text-[#1a1714]' : 'text-[#9e9890]'}`}>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-2 mb-5 ${i < current ? 'bg-[#1a1714]' : 'bg-[#e6e1db]'}`} style={{ minWidth: '20px' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Search Input ─────────────────────────────────────────────────────────────
interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search…', onSubmit, className = '' }: SearchInputProps) {
  return (
    <form 
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9890]" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-3 text-sm border border-[#e6e1db] rounded-lg bg-white text-[#1a1714] placeholder-[#c5c0b5] focus:border-[#b8724a] focus:ring-1 focus:ring-[#f5e8de] outline-none transition-colors"
      />
    </form>
  );
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────
interface BreadcrumbsProps {
  items: { label: string; onClick?: () => void }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm flex-wrap">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[#c5c0b5]" aria-hidden="true">/</span>}
            {item.onClick ? (
              <button onClick={item.onClick} className="text-[#5c5751] hover:text-[#1a1714] transition-colors">{item.label}</button>
            ) : (
              <span className="text-[#1a1714] font-medium" aria-current="page">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-[#1a1714]">{title}</h2>
        {description && <p className="text-sm text-[#5c5751] mt-0.5">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; onClick?: () => void }[];
  actions?: React.ReactNode;
  back?: () => void;
}

export function PageHeader({ title, description, breadcrumbs, actions, back }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 md:mb-8">
      <div className="flex-1 min-w-0">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className={`flex items-center gap-3 ${breadcrumbs ? 'mt-2' : ''}`}>
          {back && (
            <button onClick={back} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e6e1db] text-[#5c5751] hover:bg-[#f5f3ef] transition-colors flex-shrink-0" aria-label="Go back">
              <Icons.ChevronLeft />
            </button>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-[#1a1714] truncate">{title}</h1>
        </div>
        {description && <p className="text-sm text-[#5c5751] mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
    </div>
  );
}

// ─── Quantity Selector ────────────────────────────────────────────────────────
interface QuantitySelectorProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-[#e6e1db] rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 flex items-center justify-center text-[#5c5751] hover:bg-[#f5f3ef] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <svg width="14" height="2" viewBox="0 0 14 2" fill="none" aria-hidden="true"><path d="M1 1H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
      <span className="w-10 text-center text-sm font-semibold text-[#1a1714] tabular-nums">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 flex items-center justify-center text-[#5c5751] hover:bg-[#f5f3ef] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-px bg-[#e6e1db] ${className}`} role="separator" />;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
export const Icons = {
  Home: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 9.5L10 3L17 9.5V17H13V13H7V17H3V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  Shop: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="7" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7V5C7 3.343 8.343 2 10 2C11.657 2 13 3.343 13 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Heart: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 17.5C10 17.5 2.5 13 2.5 7.5C2.5 5.015 4.515 3 7 3C8.24 3 9.374 3.512 10 4.343C10.626 3.512 11.76 3 13 3C15.485 3 17.5 5.015 17.5 7.5C17.5 13 10 17.5 10 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  HeartFilled: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 17.5C10 17.5 2.5 13 2.5 7.5C2.5 5.015 4.515 3 7 3C8.24 3 9.374 3.512 10 4.343C10.626 3.512 11.76 3 13 3C15.485 3 17.5 5.015 17.5 7.5C17.5 13 10 17.5 10 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  Cart: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="7" cy="17" r="1.5" fill="currentColor"/><circle cx="14" cy="17" r="1.5" fill="currentColor"/><path d="M1 1H3L5.5 12H15.5L17.5 5H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  User: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M3 18C3 15 6 13 10 13C14 13 17 15 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Star: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2L12.545 7.09L18 7.91L14 11.73L15.09 17L10 14.25L4.91 17L6 11.73L2 7.91L7.455 7.09L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  Package: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2L18 6V14L10 18L2 14V6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 10L18 6M10 10L2 6M10 10V18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  Chart: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 15L7 10L11 12L17 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 18H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Settings: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.343 4.343L5.757 5.757M14.243 14.243L15.657 15.657M4.343 15.657L5.757 14.243M14.243 5.757L15.657 4.343" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Bell: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2C7 2 5 4.5 5 7V12L3 14H17L15 12V7C15 4.5 13 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 14C8 15.1 8.9 16 10 16C11.1 16 12 15.1 12 14" stroke="currentColor" strokeWidth="1.5"/></svg>,
  Check: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8L6 12L14 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  CheckCircle: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ChevronRight: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ChevronLeft: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ChevronDown: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ChevronUp: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 10L8 5L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Close: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Plus: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Edit: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  Trash: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4H14M5 4V2H11V4M12 4L11.5 13H4.5L4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Eye: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>,
  EyeOff: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2L14 14M6.5 6.6A2 2 0 009.4 9.5M4.3 4.4C2.7 5.5 1.5 7 1.5 8c0 0 2.2 4.5 6.5 4.5 1.3 0 2.4-.4 3.4-.9M7 3.6C7.3 3.5 7.7 3.5 8 3.5c4.3 0 6.5 4.5 6.5 4.5a11 11 0 01-1.4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Upload: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 10V2M5 5L8 2L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12V14H14V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Filter: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4H14M5 8H11M7 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Search: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Warning: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3L18.5 17H1.5L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 9V12M10 14.5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Shield: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2L17 5V10C17 13.5 14 17 10 18C6 17 3 13.5 3 10V5L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Orders: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="2" width="14" height="16" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7H13M7 10H13M7 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Discover: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M13 7L9.5 9.5L7 13L10.5 10.5L13 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  Menu: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  ArrowRight: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ArrowLeft: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 8H3M7 12L3 8L7 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Location: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.515 10.485 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
  CreditCard: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M1.5 6.5H14.5" stroke="currentColor" strokeWidth="1.5"/><path d="M4 9.5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Truck: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 4H10V12H1V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 6H13L15 9V12H10V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="3.5" cy="12.5" r="1" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12.5" r="1" stroke="currentColor" strokeWidth="1.5"/></svg>,
  Share: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="13" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="3" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M4.5 7L11.5 4M4.5 9L11.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Copy: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M3 11V3H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Rotate: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M14 2V6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 6C13 3.6 10.8 2 8 2C5 2 2.5 4 2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 14V10H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 10C3 12.4 5.2 14 8 14C11 14 13.5 12 14 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Sparkle: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2L11.2 8.8L18 10L11.2 11.2L10 18L8.8 11.2L2 10L8.8 8.8L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  Leaf: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M17 3C17 3 14 3 10 7C6 11 5 15 5 15C5 15 8 14 12 10C13.5 8.5 15 6 17 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M5 15L3 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Droplet: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3C10 3 4 9 4 13C4 16.314 6.686 19 10 19C13.314 19 16 16.314 16 13C16 9 10 3 10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  Palette: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 18C5.582 18 2 14.418 2 10C2 5.582 5.582 2 10 2C14.418 2 18 5.582 18 10C18 12.5 16.5 14 14.5 14C13 14 12.5 13 12.5 13C12.5 13 11.5 16 9 16C7 16 6 14 6 14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="7" cy="8" r="1.5" fill="currentColor"/><circle cx="10" cy="6" r="1.5" fill="currentColor"/><circle cx="13" cy="8" r="1.5" fill="currentColor"/></svg>,
  Layers: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2L18 6L10 10L2 6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M2 10L10 14L18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 14L10 18L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Info: ({ size = 16 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5V5.5M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Skin: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6V10M10 13V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 8C7 8 8 9 10 9C12 9 13 8 13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Bag: ({ size = 20 }: { size?: number } = {}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="7" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V6C7 4.343 8.343 3 10 3C11.657 3 13 4.343 13 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

// ─── Category Icon ────────────────────────────────────────────────────────────
export function CategoryIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const map: Record<string, React.ReactNode> = {
    leaf: <Icons.Leaf size={size} />,
    foundation: <Icons.Palette size={size} />,
    sparkle: <Icons.Sparkle size={size} />,
    droplet: <Icons.Droplet size={size} />,
    eye: <Icons.Eye size={size} />,
    lipstick: <Icons.Layers size={size} />,
    star: <Icons.Star size={size} />,
    shield: <Icons.Shield size={size} />,
  };
  return <>{map[icon] ?? <Icons.Shop size={size} />}</>;
}

// ─── Product Match Chip ───────────────────────────────────────────────────────
interface MatchChipProps {
  score: number;
  details?: string[];
  compact?: boolean;
}

export function MatchChip({ score, details, compact }: MatchChipProps) {
  const color = score >= 90 ? '#166534' : score >= 70 ? '#92400e' : '#5c5751';
  const bg = score >= 90 ? '#f0fdf4' : score >= 70 ? '#fffbeb' : '#f5f3ef';
  const border = score >= 90 ? '#86efac' : score >= 70 ? '#fcd34d' : '#e6e1db';
  return (
    <div className="text-xs rounded-lg border p-2" style={{ backgroundColor: bg, borderColor: border, color }}>
      <div className="font-bold text-sm mb-1">{score}% Match</div>
      {!compact && details?.map((d, i) => (
        <div key={i} className="flex items-center gap-1 opacity-80">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {d}
        </div>
      ))}
    </div>
  );
}

// ─── Status Dot ───────────────────────────────────────────────────────────────
export function StatusDot({ status }: { status: 'active' | 'pending' | 'error' | 'warning' | 'info' }) {
  const colors = { active: '#16a34a', pending: '#d97706', error: '#dc2626', warning: '#f59e0b', info: '#2563eb' };
  return <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[status] }} aria-hidden="true" />;
}
