import type { Config } from "tailwindcss";

export default <Partial<Config>>{
	content: ["./src/**/*.{tsx,ts,jsx,js}", "./supabase/functions/**/*.ts"],
	theme: {
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				brightpair: {
					DEFAULT: '#52A1F2',
					50: '#E9F3FE',
					100: '#D3E4FD',
					200: '#A7C9FA',
					300: '#7BAEF8',
					400: '#4F93F5',
					500: '#52A1F2',
					600: '#1363D0',
					700: '#0F4A9C',
					800: '#0A3068',
					900: '#051734',
				},
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
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))"
				}
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
				display: ["Montserrat", "sans-serif"],
				tutor: ["Merriweather", "serif"],
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '100%',
						code: {
							backgroundColor: 'var(--tw-prose-pre-bg)',
							padding: '0.25rem 0.4rem',
							borderRadius: '0.25rem',
							fontWeight: '500',
						},
						h1: {
							marginTop: '1rem',
							marginBottom: '0.5rem',
						},
						h2: {
							marginTop: '0.75rem',
							marginBottom: '0.5rem',
						},
						h3: {
							marginTop: '0.75rem',
							marginBottom: '0.5rem',
						},
						p: {
							marginTop: '0.5rem',
							marginBottom: '0.5rem',
						},
					},
				},
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'fade-in': 'fade-in 0.6s ease-out'
			}
		}
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-animate")
	]
};
