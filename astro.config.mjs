// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
	output: 'static',
	site: 'https://datos.dataengineering.ph',
	redirects: {
		'/beta': '/',
		'/beta/': '/',
	},
});
