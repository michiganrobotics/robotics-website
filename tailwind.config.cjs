/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}'],
	theme: {
		fontFamily: {
			'roboto': ["Roboto", 'sans-serif'],
			'roboto-condensed': ["Roboto Condensed", 'sans-serif']
		},
		extend: {
			colors: {
				maize: '#ffcb05',
				umichblue: '#00274c',
				tappanRed: '#9A3324',
				rossOrange: '#D86018',
				rackhamGreen: '#75988d',
				waveFieldGreen: '#A5A508',
				taubmanTeal: '#00B2A9',
				arboretumBlue: '#2F65A7',
				a2Amethyst: '#702082',
				matthaeiViolet: '#575294',
				uMMATan: '#CFC096',
				burtonTowerBeige: '#9B9A6D',
				angellHallAsh: '#989C97',
				lawQuadStone: '#655A52',
				PumaBlack: '#131516',
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						'blockquote p:first-of-type::before': false,
						'blockquote p:last-of-type::after': false,
						'figure figcaption': {
							marginTop: '0.5em',
							fontSize: '0.875em',
							lineHeight: '1.4285714',
							fontStyle: 'italic',
							color: theme('colors.gray.600'),
						},
						h2: {			
							marginTop: '1.5rem',
							marginBottom: '1.25rem',
						},
					},
				},
				invert: {
					css: {
						'--tw-prose-counters': theme('colors.maize'),
						'--tw-prose-bullets': theme('colors.maize'),
						'--tw-prose-body': theme('colors.gray[200]'),
						'figure figcaption': {
							color: theme('colors.gray.200'),
						},
					}
				}
			}),
			fontFamily: {
				sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
			  },
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
