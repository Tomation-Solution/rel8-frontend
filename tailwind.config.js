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