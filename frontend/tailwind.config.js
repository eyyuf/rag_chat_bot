/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    dark: '#4f46e5',
                },
            },
            animation: {
                'pulse-ring': 'pulse-ring 2s ease-out infinite',
                'blink': 'blink 2s ease-in-out infinite',
                'typing': 'typing 1.4s infinite',
            },
            keyframes: {
                'pulse-ring': {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '100%': { transform: 'scale(1.5)', opacity: '0' },
                },
                'blink': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.4' },
                },
                'typing': {
                    '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.7' },
                    '30%': { transform: 'translateY(-10px)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
