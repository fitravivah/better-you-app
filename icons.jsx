// Soft line icons — 1.5px stroke, rounded caps
const Icon = ({ d, size = 18, stroke = 1.6, fill = "none", children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

const I = {
  Home:    (p) => <Icon {...p}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></Icon>,
  Calendar:(p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></Icon>,
  Chart:   (p) => <Icon {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Icon>,
  Target:  (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></Icon>,
  Settings:(p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9 1.7 1.7 0 0 0 4.3 7.2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></Icon>,
  Plus:    (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>,
  Sparkle: (p) => <Icon {...p}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" /><path d="M19 16l.7 1.8L21 18.5l-1.3.7L19 21l-.7-1.8L17 18.5l1.3-.7z" /></Icon>,
  Send:    (p) => <Icon {...p}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></Icon>,
  Close:   (p) => <Icon {...p}><path d="M6 6l12 12M18 6l-6 6-6 6" /></Icon>,
  Check:   (p) => <Icon {...p}><path d="M4 12l5 5L20 6" /></Icon>,
  Sun:     (p) => <Icon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Icon>,
  Coffee:  (p) => <Icon {...p}><path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z" /><path d="M17 11h2a2 2 0 1 1 0 4h-2" /><path d="M8 3v3M12 3v3" /></Icon>,
  Plate:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /></Icon>,
  Moon:    (p) => <Icon {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Icon>,
  Apple:   (p) => <Icon {...p}><path d="M12 7c0-2 1.5-4 4-4-.2 2-1.7 4-4 4z" /><path d="M17 9c3 0 4 3 4 6 0 4-3 8-5 8-1 0-2-.5-4-.5s-3 .5-4 .5c-2 0-5-4-5-8 0-3 1-6 4-6 2 0 3 1 5 1s3-1 5-1z" /></Icon>,
  Flame:   (p) => <Icon {...p}><path d="M12 3s4 4 4 8a4 4 0 1 1-8 0c0-1.5.5-2.5 1.5-3.5C10 9 10 7 12 3z" /><path d="M9 17a5 5 0 0 0 6 0" /></Icon>,
  Drop:    (p) => <Icon {...p}><path d="M12 3s7 8 7 12a7 7 0 1 1-14 0c0-4 7-12 7-12z" /></Icon>,
  Wheat:   (p) => <Icon {...p}><path d="M12 22V8" /><path d="M12 14c-2-2-5-2-5-5 3 0 5 1 5 5z" /><path d="M12 14c2-2 5-2 5-5-3 0-5 1-5 5z" /><path d="M12 10c-2-2-5-2-5-5 3 0 5 1 5 5z" /><path d="M12 10c2-2 5-2 5-5-3 0-5 1-5 5z" /></Icon>,
  Avocado: (p) => <Icon {...p}><path d="M12 3c5 0 8 4 8 9 0 5-3 9-8 9s-8-4-8-9c0-5 3-9 8-9z" /><circle cx="12" cy="14" r="3" /></Icon>,
  Edit:    (p) => <Icon {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z" /></Icon>,
  Trash:   (p) => <Icon {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></Icon>,
  Chevron: (p) => <Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>,
  Arrow:   (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>,
  Bell:    (p) => <Icon {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9z" /><path d="M10 21a2 2 0 0 0 4 0" /></Icon>,
  Search:  (p) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Icon>,
};

window.I = I;
window.Icon = Icon;
