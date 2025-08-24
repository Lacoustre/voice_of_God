module.exports = {
  content: ['./src/**/*.{html,js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f3d4fe',
          300: '#e9b3fd',
          400: '#d946ef',
          500: '#c026d3',
          600: '#a21caf',
          700: '#86198f',
          800: '#701a75',
          900: '#581c87',
        },
        church: {
          navy: '#1e293b',
          slate: '#475569',
          light: '#f8fafc',
          cream: '#fefcfb',
        }
      },
      backgroundImage: {
        'church-gradient': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
        'section-gradient': 'linear-gradient(to bottom, #ffffff, #f8fafc, #ffffff)',
      }
    },
  },
  plugins: [],
}