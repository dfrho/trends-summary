import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'primary': 'var(--color-bg-primary)',
        'secondary': 'var(--color-bg-secondary)',
      },
      textColor: {
        'primary': 'var(--color-text-primary)',
        'secondary': 'var(--color-text-secondary)',
      },
    },
  },
  plugins: [],
};
export default config;
