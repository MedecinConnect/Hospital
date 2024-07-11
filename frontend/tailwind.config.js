// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'header-bg': "url('/src/assets/images/mask.png')",
      },
      colors: {
        primaryColor: '#3490dc',
        headingColor: '#1c3d5a',
        textColor: '#4ES45F',
        yellowColor:"#ffaa33",
        purpleColor :"#de33ff",
      },
    },
  },
  plugins: [],
}
