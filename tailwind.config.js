/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/**/*.njk",
    "src/**/*.js",
    "src/**/*.ts",
    "src/**/*.jsx",
    "src/**/*.tsx",
    "src/**/*.md",
    "src/**/*.mdx",
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx,scss}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'changa': ['Changa', 'sans-serif'],
      },
      colors: {
        primary:'var(--primary)',
        subColor: "var(--subColor)",
        footerColor: "var(--footerColor)",
        footerColorText: "var(--footerColorText)",
        customBlack:"#333333"
      },
      order: {
        '13': '13'
      },
      borderRadius: {
         mainRadius: 'var(--mainRadius)'
      },
      screens:{
        xs:"410px",
        sm:"576px",
        md:"768px",
        lg:"992px",
        xl:"1200px",
        "2xl":"1400px",
      }
      ,
      container: {
				center: true,
				padding: {
					DEFAULT: "0.5rem",
					sm: "0.5rem",
					md: "1rem",
					lg: "2rem",
					xl: "3rem",
					"2xl": "4rem",
				},
			},
    },
  },
}

