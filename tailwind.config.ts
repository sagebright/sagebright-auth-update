
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
		screens: {
			sm: '640px',   // Mobile landscape/small tablet
			md: '768px',   // Tablet portrait
			lg: '1024px',  // Tablet landscape/small desktop
			xl: '1280px',  // Desktop
			'2xl': '1536px', // Large desktop
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Semantic brand colors
				primary: 'hsl(var(--primary))',
				'primary-foreground': 'hsl(var(--primary-foreground))',
				
				secondary: 'hsl(var(--secondary))',
				'secondary-foreground': 'hsl(var(--secondary-foreground))',
				
				accent1: 'hsl(var(--accent1))',
				'accent1-foreground': 'hsl(var(--accent1-foreground))',
				
				accent2: 'hsl(var(--accent2))',
				'accent2-foreground': 'hsl(var(--accent2-foreground))',
				
				charcoal: 'hsl(var(--charcoal))',
				'charcoal-foreground': 'hsl(var(--charcoal-foreground))',
				
				// UI semantics 
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
				
				// Legacy color mapping - for backward compatibility
				sagebright: {
					green: 'hsl(var(--primary))',     // Maps to primary
					gold: 'hsl(var(--accent2))',      // Maps to accent2
					accent: 'hsl(var(--secondary))',  // Maps to secondary
					navy: 'hsl(var(--charcoal))',     // Maps to charcoal
					coral: 'hsl(var(--accent1))',     // Maps to accent1
				},
				bittersweet: 'hsl(var(--accent1))',   // Maps to accent1 
				sunglow: 'hsl(var(--accent2))',       // Maps to accent2
				
				// Sidebar specific colors
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				dmSans: ['DM Sans', 'sans-serif'],
				helvetica: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
				roboto: ['Roboto', 'Arial', 'sans-serif'],
			},
			fontSize: {
				// Display typography
				'display-lg': ['4rem', { lineHeight: '1.2', fontWeight: '700' }],    // 64px
				'display': ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],     // 56px
				'display-sm': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],    // 48px
				
				// Heading typography
				'heading-xl': ['2.5rem', { lineHeight: '1.3', fontWeight: '700' }],  // 40px
				'heading': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],       // 32px
				'heading-sm': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }], // 28px
				
				// Subheading typography
				'subheading': ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }],  // 24px
				'subheading-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }], // 20px
				
				// Body text typography
				'body-lg': ['1.25rem', { lineHeight: '1.5', fontWeight: '400' }],    // 20px
				'body': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],      // 18px
				'body-sm': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],       // 16px
				'body-xs': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],   // 14px
				
				// Utility typography
				'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],    // 12px
				'cta': ['1.125rem', { lineHeight: '1.3', fontWeight: '600' }],       // 18px button text
				
				// Legacy font-sizes (for backward compatibility)
				'headline': ['2.5rem', { lineHeight: '1.3', fontWeight: '700' }],    // 40px
				'headline-lg': ['3.5rem', { lineHeight: '1.3', fontWeight: '700' }], // 56px
				'subheading-lg': ['2rem', { lineHeight: '1.3', fontWeight: '500' }], // 32px
			},
			spacing: {
				// Core spacing scale (4px increments)
				'0': '0',
				'0.5': '0.125rem',   // 2px
				'1': '0.25rem',      // 4px
				'1.5': '0.375rem',   // 6px
				'2': '0.5rem',       // 8px
				'2.5': '0.625rem',   // 10px
				'3': '0.75rem',      // 12px
				'3.5': '0.875rem',   // 14px
				'4': '1rem',         // 16px
				'5': '1.25rem',      // 20px
				'6': '1.5rem',       // 24px
				'7': '1.75rem',      // 28px
				'8': '2rem',         // 32px
				'9': '2.25rem',      // 36px
				'10': '2.5rem',      // 40px
				'11': '2.75rem',     // 44px
				'12': '3rem',        // 48px
				'14': '3.5rem',      // 56px
				'16': '4rem',        // 64px
				'20': '5rem',        // 80px
				'24': '6rem',        // 96px
				'28': '7rem',        // 112px
				'32': '8rem',        // 128px
				'36': '9rem',        // 144px
				'40': '10rem',       // 160px
				'44': '11rem',       // 176px
				'48': '12rem',       // 192px
				'52': '13rem',       // 208px
				'56': '14rem',       // 224px
				'60': '15rem',       // 240px
				'64': '16rem',       // 256px
				'72': '18rem',       // 288px
				'80': '20rem',       // 320px
				'96': '24rem',       // 384px
				
				// Special spacing
				'text-spacing': '0.8rem', // Legacy - special text spacing
			},
			borderRadius: {
				'lg': 'var(--radius)',
				'md': 'calc(var(--radius) - 2px)',
				'sm': 'calc(var(--radius) - 4px)',
				'2xl': '12px',  // Adding the 2xl border radius
				'DEFAULT': '0.5rem', // 8px (standard radius)
			},
			boxShadow: {
				'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
				'card-hover': '0 8px 16px rgba(0, 0, 0, 0.08)',
				'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // standard shadow
				'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
				'none': 'none',
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
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
			},
			transitionDuration: {
				'5000': '5000ms',
				'8000': '8000ms',
			},
			scale: {
				'103': '1.03',
			},
			brightness: {
				'105': '1.05',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
