import type { SVGProps } from "react";

export type IconName =
  | "vaccine"
  | "bug"
  | "report"
  | "paw"
  | "book"
  | "lab"
  | "emergency"
  | "shield"
  | "clock"
  | "calendar"
  | "check"
  | "location"
  | "phone"
  | "mail"
  | "whatsapp"
  | "upload"
  | "gps"
  | "menu"
  | "close"
  | "arrow";

const paths: Record<IconName, React.ReactNode> = {
  vaccine: (
    <>
      <path d="m18 2 4 4" />
      <path d="m17 7 3-3" />
      <path d="M19 9 8.7 19.3a2.4 2.4 0 0 1-1.4.7l-3 .4.4-3a2.4 2.4 0 0 1 .7-1.4L15 5.7" />
      <path d="m9 11 2 2" />
      <path d="m12 8 2 2" />
    </>
  ),
  bug: (
    <>
      <rect x="8" y="6" width="8" height="14" rx="4" />
      <path d="M12 6V4a2 2 0 0 1 2-2" />
      <path d="M8 10 4 8m4 4H3m5 4-4 2m12-8 4-2m-4 4h5m-5 4 4 2" />
    </>
  ),
  report: (
    <>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  paw: (
    <g fill="currentColor" stroke="none">
      <ellipse cx="7" cy="8.5" rx="1.7" ry="2.3" />
      <ellipse cx="12" cy="6.5" rx="1.8" ry="2.5" />
      <ellipse cx="17" cy="8.5" rx="1.7" ry="2.3" />
      <path d="M12 11c2.8 0 5 2.2 5 4.6 0 1.9-1.6 3.4-3.5 3.4-.6 0-1-.4-1.5-.4s-.9.4-1.5.4C8.6 19 7 17.5 7 15.6 7 13.2 9.2 11 12 11Z" />
    </g>
  ),
  book: (
    <>
      <path d="M12 6.5C10.5 5 8 4.5 4 5v13c4-.5 6.5 0 8 1.5" />
      <path d="M12 6.5C13.5 5 16 4.5 20 5v13c-4-.5-6.5 0-8 1.5" />
      <path d="M12 6.5v13" />
    </>
  ),
  lab: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6.5L5.2 17.4A2 2 0 0 0 6.9 20.5h10.2a2 2 0 0 0 1.7-3.1L14 9.5V3" />
      <path d="M7.5 14h9" />
    </>
  ),
  emergency: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5c0 4.5 3.2 8.5 7.5 10 4.3-1.5 7.5-5.5 7.5-10V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
      <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  location: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  phone: (
    <path d="M6.5 3h3l1.5 5-2 1.5a12 12 0 0 0 5 5l1.5-2 5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5 5 16a8 8 0 1 1 3 3l-4.5 1.5Z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.6.8-1.1l-.5-1.1a.7.7 0 0 0-.8-.4l-1 .3a5 5 0 0 1-2-2l.3-1a.7.7 0 0 0-.4-.8l-1.1-.5c-.5-.2-1.1.2-1.1.8Z" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15V4" />
      <path d="m8 8 4-4 4 4" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </>
  ),
  gps: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  title?: string;
};

export function Icon({ name, size = 24, title, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
