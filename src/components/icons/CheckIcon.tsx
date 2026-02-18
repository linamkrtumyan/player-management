import { memo } from 'react';


export const CheckIcon = memo(() => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="check-icon"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
));

CheckIcon.displayName = 'CheckIcon';
