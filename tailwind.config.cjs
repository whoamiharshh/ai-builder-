module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: '#7c3aed',
        glow: '#8b5cf6',
        flux: '#22d3ee',
        midnight: '#020617',
        obsidian: '#05070f',
      },
      boxShadow: {
        plasma: '0 25px 80px rgba(124,60,237,0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(124, 92, 230, 0.24), transparent 30%), radial-gradient(circle at bottom right, rgba(34, 211, 238, 0.18), transparent 20%)',
      },
    },
  },
  plugins: [],
};
