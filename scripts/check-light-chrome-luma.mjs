#!/usr/bin/env node
/**
 * Failing gate for light-mode display chrome.
 * Parses --beta-chrome under html[data-theme='light'] in beta.css
 * and requires mean relative luminance above the ink floor that made
 * DATOS / ABOUT / REGISTER wordmarks read as near-black.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'src/designs/beta/beta.css'), 'utf8');

const lightBlock = css.match(/html\[data-theme=['"]light['"]\]\s*\{([\s\S]*?)\n\}/);
if (!lightBlock) {
	console.error('FAIL: no html[data-theme=light] block');
	process.exit(1);
}

const chrome = lightBlock[1].match(/--beta-chrome:\s*linear-gradient\(([\s\S]*?)\);/);
if (!chrome) {
	console.error('FAIL: no --beta-chrome linear-gradient in light block');
	process.exit(1);
}

const hexes = [...chrome[1].matchAll(/#([0-9a-fA-F]{6})/g)].map((m) => m[1]);
if (hexes.length < 3) {
	console.error('FAIL: expected at least 3 hex stops, got', hexes.length);
	process.exit(1);
}

const luma = (hex) => {
	const n = parseInt(hex, 16);
	const r = (n >> 16) & 255;
	const g = (n >> 8) & 255;
	const b = n & 255;
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const values = hexes.map(luma);
const mean = values.reduce((a, b) => a + b, 0) / values.length;
const MIN_MEAN = 110;

const holo = lightBlock[1].match(/--beta-holo-stops:\s*([^;]+);/);
const holoHexes = holo ? [...holo[1].matchAll(/#([0-9a-fA-F]{6})/g)].map((m) => m[1]) : [];
const holoMean = holoHexes.length
	? holoHexes.map(luma).reduce((a, b) => a + b, 0) / holoHexes.length
	: 0;
const MAX_HOLO_MEAN = 175;

console.log(
	JSON.stringify(
		{
			chromeStops: hexes.map((h) => `#${h}`),
			chromeMeanLuma: +mean.toFixed(1),
			holoStops: holoHexes.map((h) => `#${h}`),
			holoMeanLuma: +holoMean.toFixed(1),
			thresholds: { chromeMeanMin: MIN_MEAN, holoMeanMax: MAX_HOLO_MEAN },
		},
		null,
		2,
	),
);

if (mean < MIN_MEAN) {
	console.error(
		`FAIL: light --beta-chrome mean luma ${mean.toFixed(1)} < ${MIN_MEAN} (too dark / ink-like)`,
	);
	process.exit(1);
}

if (holoHexes.length && holoMean > MAX_HOLO_MEAN) {
	console.error(
		`FAIL: light --beta-holo-stops mean luma ${holoMean.toFixed(1)} > ${MAX_HOLO_MEAN} (too washed for light bg)`,
	);
	process.exit(1);
}

console.log('PASS: light chrome and holo luminance gates');
