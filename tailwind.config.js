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
        "activeLink":"#0c3958",
        "textColor":"#1E1E1E",

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

        // Keep your existing static colors
        "primary":{
          "blue":"#015595",
          "dark1":"#003964",
          "dark2":"#002541",
          "light1":"#006ABB",
          "light2":"#0084E8",
        },
        "secondary":{
          "blue":"#01AAFF",
          "blue-variant":"#67CCFF",
          "purple-variant":"#AC94FF",
          "btn":"#ccddea"
        },
        "neutral":{
          "1":"#6A7181",
          "2":"#9DA3AF",
          "3":"#E6E7EA",
        },
        "success":{
          "main":"#00A03B",
          "variant1":"#4ADE80",
          "variant2":"#BBF7D0",
        },
        "warning":{
          "main":"#D97706",
          "variant1":"#FBBF24",
          "variant2":"#FDE68A",
        },
        "error":{
          "main":"#DC2626",
          "variant1":"#EF4444",
          "variant2":"#FCA5A5",
        },
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
