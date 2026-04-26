import type { SVGProps } from 'react';

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="#4285F4"
        d="M21.82 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.5a4.7 4.7 0 0 1-2.03 3.08v2.56h3.29c1.93-1.77 3.06-4.39 3.06-7.65Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.76 0 5.08-.91 6.77-2.46l-3.29-2.56c-.91.61-2.07.97-3.48.97-2.67 0-4.93-1.8-5.74-4.22H2.86v2.65A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.26 13.73A6 6 0 0 1 5.94 12c0-.6.11-1.17.32-1.73V7.62H2.86A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.38l3.18-2.65Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.05c1.5 0 2.84.52 3.9 1.53l2.92-2.92C17.07 3.04 14.75 2 12 2A10 10 0 0 0 2.86 7.62l3.4 2.65C7.07 7.85 9.33 6.05 12 6.05Z"
      />
    </svg>
  );
}
