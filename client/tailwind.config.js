/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':"#8b4513",
        'primary-dark':"#7b3503",
        'secondary':"#fffacd",
        'secondary-dark':"#ebe6b9",
      }
    },
  },
}

