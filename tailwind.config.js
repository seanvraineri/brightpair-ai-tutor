module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Montserrat', 'sans-serif'],
                mont: ['Montserrat', 'sans-serif'],
            },
            backgroundColor: {
                brightpair: '#4D8BF9',
            },
            textColor: {
                brightpair: '#4D8BF9',
            },
            borderColor: {
                DEFAULT: '#e5e7eb',
            },
            borderRadius: {
                DEFAULT: "8px",
                sm: "6px",
                md: "12px",
                lg: "16px",
                xl: "24px",
                "2xl": "32px",
                full: "9999px",
            },
            boxShadow: {
                card: "0 10px 20px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(77, 139, 249, 0.04)",
                button: "0 4px 8px -2px rgba(77, 139, 249, 0.25)",
                md: "0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(77, 139, 249, 0.04)",
                lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(77, 139, 249, 0.04)",
                inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.edge': {
                    backgroundColor: 'white',
                    borderRadius: '0px',
                    boxShadow: '0 1px 4px 0 rgb(0 0 0 / 0.06)',
                    border: '1px solid rgba(229, 231, 235, 1)',
                },
            }
            addUtilities(newUtilities)
        },
    ],
} 