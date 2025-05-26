/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          DEFAULT: '#3B82F6',
          500: '#3B82F6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          DEFAULT: '#8B5CF6',
          500: '#8B5CF6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065'
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          DEFAULT: '#F59E0B',
          400: '#F59E0B',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        financial: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          pending: '#8B5CF6'
        },
        chart: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          tertiary: '#10B981',
          quaternary: '#F59E0B'
        },
        interactive: {
          primary: '#3B82F6',
          'primary-hover': '#2563eb',
          'primary-active': '#1d4ed8',
          secondary: '#8B5CF6',
          'secondary-hover': '#7c3aed',
          'secondary-active': '#6d28d9',
          success: '#10B981',
          'success-hover': '#059669',
          'success-active': '#047857',
          warning: '#F59E0B',
          'warning-hover': '#d97706',
          'warning-active': '#b45309',
          danger: '#EF4444',
          'danger-hover': '#dc2626',
          'danger-active': '#b91c1c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'interactive': '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
        'interactive-hover': '0 8px 25px 0 rgba(59, 130, 246, 0.4)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'focus': '0 0 0 3px rgba(59, 130, 246, 0.1)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      minHeight: {
        'touch': '44px'
      },
      minWidth: {
        'touch': '44px'
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}