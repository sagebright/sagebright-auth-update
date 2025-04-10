
import type { Config } from "tailwindcss";
import { themeConfig } from "./src/theme";

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
		screens: themeConfig.screens,
		extend: {
			colors: {
				...themeConfig.colors,
				tooltip: {
					DEFAULT: 'hsl(var(--tooltip))',
					foreground: 'hsl(var(--tooltip-foreground))'
				},
				// Additional accessible colors with proper contrast
				accessible: {
					link: 'hsl(var(--accessible-link))', // High contrast link color
					error: 'hsl(var(--accessible-error))', // High contrast error color
					success: 'hsl(var(--accessible-success))', // High contrast success color
					warning: 'hsl(var(--accessible-warning))' // High contrast warning color
				},
			},
			fontFamily: themeConfig.fontFamily,
			fontSize: themeConfig.fontSize,
			spacing: themeConfig.spacing,
			borderRadius: themeConfig.borderRadius,
			boxShadow: themeConfig.boxShadow,
			keyframes: themeConfig.keyframes,
			animation: themeConfig.animation,
			transitionDuration: themeConfig.transitionDuration,
			scale: themeConfig.scale,
			brightness: themeConfig.brightness,
			// Add focus ring styles
			ringWidth: {
				DEFAULT: '2px',
				0: '0',
				1: '1px',
				2: '2px',
				3: '3px',
				4: '4px',
			},
			ringOffsetWidth: {
				DEFAULT: '2px',
				0: '0',
				1: '1px',
				2: '2px',
				3: '3px',
				4: '4px',
			},
			ringColor: {
				DEFAULT: 'hsl(var(--ring))',
				primary: 'hsl(var(--primary))',
				secondary: 'hsl(var(--secondary))',
				accent1: 'hsl(var(--accent1))',
			},
			ringOffsetColor: {
				DEFAULT: 'hsl(var(--background))',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
