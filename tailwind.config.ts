import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Extra tier above Tailwind's 2xl (1536px) so 27"+/4K displays get their
      // own layout step instead of topping out at the desktop breakpoint.
      screens: {
        '3xl': '1920px',
      },
      colors: {
        brand: {
          green: { DEFAULT: '#2E7D32', dark: '#1B5E20', light: '#E8F5E9', mid: '#4CAF50', pale: '#C8E6C9' },
          orange: { DEFAULT: '#FF6D00', light: '#FF9100', bg: '#FFF3E0', deep: '#E65100', dark: '#BF360C' },
        },
        surface: { DEFAULT: '#FAFAFA', card: '#FFFFFF', border: '#E0E0E0', muted: '#F5F5F5' },
        txt: { DEFAULT: '#212121', secondary: '#757575', muted: '#9E9E9E', hint: '#BDBDBD' },
        accent: { red: '#EF5350', yellow: '#FFC107', blue: '#1976D2', purple: '#7B1FA2' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        pill: '9999px',
        btn: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
