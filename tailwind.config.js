/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
        "./app/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#f0f4ff",
                    100: "#e0e9ff",
                    200: "#c7d7ff",
                    300: "#a4b8ff",
                    400: "#818eff",
                    500: "#667eea",
                    600: "#5568d3",
                    700: "#4751b8",
                    800: "#3d4496",
                    900: "#383e7a",
                },
            },
        },
    },
    plugins: [],
}
