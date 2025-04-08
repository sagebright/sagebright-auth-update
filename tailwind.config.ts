
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
			colors: themeConfig.colors,
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
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
