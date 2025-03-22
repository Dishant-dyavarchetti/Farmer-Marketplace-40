/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#7FD287',
          DEFAULT: '#4EA96A',
          dark: '#3A8A55',
        },
        secondary: {
          light: '#F5FBF5',
          DEFAULT: '#E6F3E6',
          dark: '#C7E4C7',
        },
        accent: {
          light: '#62CBC0',
          DEFAULT: '#3AAFA9',
          dark: '#2B8A84',
        },
        text: {
          DEFAULT: '#1A2E1F',
          light: '#2E4A33',
          dark: '#0D1810',
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#F7FAF7',
        },
        neutral: {
          light: '#F0F2F0',
          DEFAULT: '#DEE4DE',
          dark: '#BFC7BF',
        },
        success: '#48BB78',
        warning: '#F6AD55',
        error: '#F56565',
        info: '#4299E1',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 