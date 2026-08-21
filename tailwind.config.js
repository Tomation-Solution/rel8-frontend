/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        // Dynamic organization colors using CSS variables.
        // Every purple in the redesign resolves through these — a tenant with a green
        // brand must come out green. See REDESIGN.md §1.
        "org-primary": {
          DEFAULT: 'rgb(var(--color-org-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-org-primary-hover) / <alpha-value>)',
        },
        "org-secondary": {
          DEFAULT: 'rgb(var(--color-org-secondary) / <alpha-value>)',
          hover: 'rgb(var(--color-org-secondary-hover) / <alpha-value>)',
        },
        // Same hue as the primary, lightened — the lavender wash behind active nav items,
        // table headers, card footers, chat bubbles and info chips.
        "org-tint": {
          DEFAULT: 'rgb(var(--color-org-tint) / <alpha-value>)',
          strong: 'rgb(var(--color-org-tint-strong) / <alpha-value>)',
        },

        // Redesign surface tokens
        "ink": "#1E1E1E",
        "muted": "#6A7181",
        "hairline": "#ECEDEF",
        "app": "#FAFAFB",
        "past": "#BEC1C7",

        // Status colours — one pair per state, used by <StatusPill>
        "status": {
          "success": "#4EAE4E",
          "success-bg": "#E7F4E7",
          "danger": "#FF2424",
          "danger-bg": "#FFEAEA",
          "warning": "#D97706",
          "warning-bg": "#FDF3E2",
          "neutral": "#6A7181",
          "neutral-bg": "#F1F2F4",
        },

        /*
          The pre-redesign palette (primary.blue, secondary.*, neutral.*, activeLink,
          textColor, and the flat success/warning/error scales) was removed in M15. Nothing
          referenced it any more, and leaving it in invited exactly the bug it caused:
          a stored `#015595` repainting the app in a blue nobody chose, and
          `bg-neutral-4` — a class that never existed — rendering skeleton bars invisible.

          Colours now come from `org-*` (per-tenant, via CSS variables) and the fixed
          surface/status tokens above.
        */
      },
      fontFamily:{
        sans:['DM Sans', 'sans-serif']
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}
