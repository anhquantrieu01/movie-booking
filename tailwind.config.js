module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // App Router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Pages Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add any other directories where you use Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}