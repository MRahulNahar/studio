import * as React from 'react';

export const AppLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M6.34 17.66 5 19" />
    <path d="M17.66 6.34 19 5" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m19 19-1.66-1.66" />
    <path d="m5 5 1.66 1.66" />
    <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    <path d="M12 8v8" />
    <path d="M16 16a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
  </svg>
);
