/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#E91E63',
      },
      fontSize: {
        'xs':   ['14px', { lineHeight: '1.6'  }],
        'sm':   ['16px', { lineHeight: '1.65' }],
        'base': ['18px', { lineHeight: '1.7'  }],
        'lg':   ['20px', { lineHeight: '1.6'  }],
        'xl':   ['22px', { lineHeight: '1.5'  }],
        '2xl':  ['26px', { lineHeight: '1.4'  }],
        '3xl':  ['32px', { lineHeight: '1.3'  }],
        '4xl':  ['38px', { lineHeight: '1.2'  }],
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
