import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// BRAINROT CYBERPUNK COLORS
				'neon-cyan': 'hsl(var(--neon-cyan))',
				'neon-pink': 'hsl(var(--neon-pink))',
				'neon-green': 'hsl(var(--neon-green))',
				'neon-orange': 'hsl(var(--neon-orange))',
				'neon-purple': 'hsl(var(--neon-purple))',
				'neon-yellow': 'hsl(var(--neon-yellow))',
				'neon-red': 'hsl(var(--neon-red))',
				'neon-blue': 'hsl(var(--neon-blue))',
				'dark-bg': 'hsl(var(--dark-bg))',
				'dark-card': 'hsl(var(--dark-card))',
				'dark-border': 'hsl(var(--dark-border))'
			},
			backgroundImage: {
				'gradient-cyber': 'var(--gradient-cyber)',
				'gradient-fire': 'var(--gradient-fire)',
				'gradient-matrix': 'var(--gradient-matrix)',
				'gradient-dark': 'var(--gradient-dark)'
			},
			boxShadow: {
				'glow-cyan': 'var(--shadow-glow-cyan)',
				'glow-pink': 'var(--shadow-glow-pink)',
				'glow-green': 'var(--shadow-glow-green)',
				'glow-orange': 'var(--shadow-glow-orange)',
				'glow-purple': 'var(--shadow-glow-purple)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'neon-pulse': {
					'0%, 100%': { opacity: '1', boxShadow: 'var(--shadow-glow-cyan)' },
					'50%': { opacity: '0.8', boxShadow: '0 0 60px hsl(var(--neon-cyan) / 0.8)' }
				},
				'glitch': {
					'0%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-2px, 2px)' },
					'40%': { transform: 'translate(-2px, -2px)' },
					'60%': { transform: 'translate(2px, 2px)' },
					'80%': { transform: 'translate(2px, -2px)' },
					'100%': { transform: 'translate(0)' }
				},
				'matrix-rain': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100vh)' }
				},
				'cyber-shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%': { transform: 'translateX(-2px)' },
					'20%': { transform: 'translateX(2px)' },
					'30%': { transform: 'translateX(-2px)' },
					'40%': { transform: 'translateX(2px)' },
					'50%': { transform: 'translateX(-1px)' },
					'60%': { transform: 'translateX(1px)' },
					'70%': { transform: 'translateX(-1px)' },
					'80%': { transform: 'translateX(1px)' },
					'90%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
				'glitch': 'glitch 0.3s ease-in-out infinite',
				'matrix-rain': 'matrix-rain 3s linear infinite',
				'cyber-shake': 'cyber-shake 0.5s ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;