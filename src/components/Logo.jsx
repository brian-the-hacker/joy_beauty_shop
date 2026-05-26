import { useId } from 'react';

export default function Logo({ size = 48, className, ...props }) {
  const id = useId(); // prevents gradient ID collisions

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      role="img"
      aria-label="Logo"
      {...props}
    >
      <circle
        cx="40"
        cy="40"
        r="38"
        stroke={`url(#${id}-goldRing)`}
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="40"
        cy="40"
        r="32"
        stroke={`url(#${id}-goldRing)`}
        strokeWidth="0.5"
        fill="none"
        strokeDasharray="2 4"
        opacity="0.5"
      />
      <path
        d="M28 22 L28 54 L52 54"
        stroke={`url(#${id}-goldStroke)`}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M52 54 L56 50 L60 54 L56 58 Z"
        fill={`url(#${id}-goldFill)`}
        opacity="0.9"
      />
      <circle cx="28" cy="22" r="2.5" fill={`url(#${id}-goldFill)`} />
      <circle cx="28" cy="54" r="2.5" fill={`url(#${id}-goldFill)`} />

      <defs>
        <linearGradient id={`${id}-goldRing`} x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#c9973a" />
          <stop offset="50%" stopColor="#e5b95a" />
          <stop offset="100%" stopColor="#c9973a" />
        </linearGradient>
        <linearGradient id={`${id}-goldStroke`} x1="20" y1="20" x2="60" y2="60">
          <stop offset="0%" stopColor="#e5b95a" />
          <stop offset="50%" stopColor="#f5e0a8" />
          <stop offset="100%" stopColor="#c9973a" />
        </linearGradient>
        <linearGradient id={`${id}-goldFill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e5b95a" />
          <stop offset="100%" stopColor="#c9973a" />
        </linearGradient>
      </defs>
    </svg>
  );
}