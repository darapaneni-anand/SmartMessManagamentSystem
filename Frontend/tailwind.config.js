/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        background: '#F9FAFB',
        accent: '#6366F1',
        'light-bg': '#FFFFFF',
        'light-gray': '#F3F4F6',
        'text-dark': '#111827',
        'text-gray': '#6B7280',
      },
      fontFamily: {
        poppins: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
        'gradient-button': 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};


