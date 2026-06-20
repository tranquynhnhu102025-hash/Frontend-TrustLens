/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Trúc có thể đổi mã màu dự án ở đây
        trust: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        minimal: {
          bg: '#fafafa',
          surface: '#ffffff',
          border: '#e5e7eb',
          'text-primary': '#111827',
          'text-secondary': '#4b5563',
          'text-muted': '#9ca3af'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'minimal-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'minimal-md': '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'minimal-lg': '12px',
        'minimal-xl': '16px',
      }
    },
  },
  plugins: [],
}