import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        shagun: {
          red: '#C41E3A',
          gold: '#D4AF37',
          maroon: '#800020',
          cream: '#FFF8DC',
          emerald: '#046307',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      keyframes: {
        'envelope-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'envelope-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' },
        },
        'cash-fan': {
          '0%': { transform: 'translateY(20px) rotate(0deg)', opacity: '0' },
          '100%': { transform: 'translateY(0) rotate(var(--fan-angle))', opacity: '1' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        'counter-up': {
          '0%': { content: '"₹0"' },
          '100%': { content: 'var(--final-amount)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'slide-up-spring': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '60%': { transform: 'translateY(-10%)', opacity: '1' },
          '80%': { transform: 'translateY(3%)' },
          '100%': { transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'envelope-float': 'envelope-float 3s ease-in-out infinite',
        'envelope-glow': 'envelope-glow 2s ease-in-out infinite',
        'cash-fan': 'cash-fan 0.5s ease-out forwards',
        'confetti-fall': 'confetti-fall 3s ease-in forwards',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'slide-up-spring': 'slide-up-spring 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
        shimmer: 'shimmer 2s linear infinite',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
