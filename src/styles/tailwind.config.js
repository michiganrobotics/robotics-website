/** @type {import('tailwindcss').Config} */
module.exports = {
	theme: {
		extend: {
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						'--tw-prose-headings': theme('colors.umichblue'),
						'--tw-prose-bullets': theme('colors.arboretumBlue'),
						'blockquote p:first-of-type::before': false,
						'blockquote p:last-of-type::after': false,
						blockquote: {
							fontStyle: 'normal',
							borderLeftWidth: '4px',
							borderLeftColor: theme('colors.maize'),
							backgroundColor: theme('colors.gray.100'),
							borderRadius: '0.125rem',
							paddingTop: '0.25em',
							paddingBottom: '0.25em',
							paddingRight: '1em',
						},
						'blockquote p': {
							fontStyle: 'normal',
						},
						'figure figcaption': {
							marginTop: '0.5em',
							fontSize: '0.875em',
							lineHeight: '1.4285714',
							fontStyle: 'normal',
							color: theme('colors.gray.600'),
						},
						h2: {			
							marginTop: '1.5rem',
							marginBottom: '1.25rem',
						},
						'.columnlist ul h3:first-child': {
							marginTop: '1rem',
							marginBottom: '.5rem',
						},
						'a:not(.no-underline)': {
							textDecoration: 'underline',
							textDecorationThickness: '1px',
							textUnderlineOffset: '2px',
						},
						'a:not(.no-underline):hover': {
							textDecorationColor: theme('colors.maize'),
							textDecorationThickness: '2px',
						},
						'.no-underline': {
							textDecoration: 'none !important',
						},
						'.textwithimage > .prose > p:first-of-type': {
							marginTop: '0',
						},
					},
				},
				invert: {
					css: {
						'--tw-prose-headings': theme('colors.neutral.50'),
						'--tw-prose-counters': theme('colors.maize'),
						'--tw-prose-bullets': theme('colors.maize'),
						'--tw-prose-body': theme('colors.gray[200]'),
						'figure figcaption': {
							color: theme('colors.gray.200'),
						},
						blockquote: {
							borderLeftColor: theme('colors.maize'),
							backgroundColor: 'rgba(47, 101, 167, 0.15)',
						},
						'a': {
							textDecoration: 'underline',
							textDecorationThickness: '1px',
							textUnderlineOffset: '2px',
						},
						'a:hover': {
							textDecorationColor: theme('colors.maize'),
							textDecorationThickness: '2px',
						},
					}
				}
			}),
			fontFamily: {
				sans: ["Open Sans", 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}