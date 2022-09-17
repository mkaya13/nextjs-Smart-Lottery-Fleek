/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"], // It says we want to use tailwind on these folders. pages + components 
    theme: {
        extend: {},
    },
    plugins: [],
}
