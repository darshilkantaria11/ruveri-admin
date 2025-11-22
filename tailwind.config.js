/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        b1: "#4e0001",
        b2: "#99000a",
        b3: "#f7ecdb",
        g1: "#F8F5E9",
        g2: "#1b4638",
        g3: "#F6FCDF",
        g4: "#073404",
        y1: "#F0B94B",
        h1: "#BABF2D",
        bl: "#F8DDBF",
        bd: "#CE7612",
        pl: "#E7E8B5",
        pd: "#727A01",
        pm: "#BABF2D",
        rd: "#EA0B44",
        rl: "#FBCEDA",
        brl: "#E7E0D3",
        brd: "#9B8259",
        t1: "#F8FDF5",
        t2: "#FDFAF5",
        t3: "#F9FDF5",
        t4: "#FDF5F5",
        tb1: "#AE956C",
        tb2: "#E8902C",
        tb3: "#BABF2D",
        tb4: "#EA0B44",
        green: {
          500: '#4CAF50', // Adjust the green shade as needed
          700: '#388E3C',
          900: '#1B5E20',
        },
        orange: {
          700: '#E65100',
        },
        red: {
          700: '#D32F2F',
        },
      },
    },
  },
  plugins: [],
};
