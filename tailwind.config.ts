import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hub colors
        hub: {
          bg: '#FFFFFF',
          text: '#000000',
          gray: {
            light: '#F5F5F5',
            DEFAULT: '#9CA3AF',
            dark: '#374151',
          },
        },
        // Uniformish brand colors
        uniformish: {
          bg: '#1A1A1A',
          text: '#F5F5F5',
          accent: '#1E3A8A', // Deep navy blue
          charcoal: '#2D2D2D',
        },
        // Catnip brand colors
        catnip: {
          bg: '#FFFBF5',
          text: '#2D2D2D',
          accent: '#EA580C', // Burnt orange
          warm: '#FED7AA',
          wood: '#92400E',
        },
        // Bad Arctic brand colors
        badArctic: {
          bg: '#FFFFFF',
          text: '#1F2937',
          accent: '#9CA3AF', // Silver
          platinum: '#E5E7EB',
          ice: '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
        serif: ['Playfair Display', 'Garamond', 'serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
