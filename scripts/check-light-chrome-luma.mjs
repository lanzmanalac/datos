#!/usr/bin/env node
/**
 * Light display chrome must sit between ink-black and washed pastel.
 * Too dark (mean < 55) → heavy navy blocks on light pages.
 * Too bright (mean > 120) → blue marks wash into the pale field.
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
const MIN_MEAN = 45;
const MAX_MEAN = 100;

const text = lightBlock[1].match(/--beta-text:\s*(#[0-9a-fA-F]{6})/);
const textLuma = text ? luma(text[1].slice(1)) : null;
const MAX_TEXT_LUMA = 40;

const holo = lightBlock[1].match(/--beta-holo-stops:\s*([^;]+);/);
const holoHexes = holo ? [...holo[1].matchAll(/#([0-9a-fA-F]{6})/g)].map((m) => m[1]) : [];
const holoMean = holoHexes.length
	? holoHexes.map(luma).reduce((a, b) => a + b, 0) / holoHexes.length
	: 0;
const MAX_HOLO_MEAN = 120;

console.log(
	JSON.stringify(
		{
			chromeStops: hexes.map((h) => `#${h}`),
			chromeMeanLuma: +mean.toFixed(1),
			text: text?.[1] ?? null,
			textLuma: textLuma === null ? null : +textLuma.toFixed(1),
			holoStops: holoHexes.map((h) => `#${h}`),
			holoMeanLuma: +holoMean.toFixed(1),
			thresholds: {
				chromeMeanMin: MIN_MEAN,
				chromeMeanMax: MAX_MEAN,
				textLumaMax: MAX_TEXT_LUMA,
				holoMeanMax: MAX_HOLO_MEAN,
			},
		},
		null,
		2,
	),
);

let failed = false;
if (mean < MIN_MEAN) {
	console.error(`FAIL: chrome mean ${mean.toFixed(1)} < ${MIN_MEAN} (ink-like)`);
	failed = true;
}
if (mean > MAX_MEAN) {
	console.error(`FAIL: chrome mean ${mean.toFixed(1)} > ${MAX_MEAN} (washes on light field)`);
	failed = true;
}
if (textLuma !== null && textLuma > MAX_TEXT_LUMA) {
	console.error(`FAIL: --beta-text luma ${textLuma.toFixed(1)} > ${MAX_TEXT_LUMA} (body too soft)`);
	failed = true;
}
if (holoHexes.length && holoMean > MAX_HOLO_MEAN) {
	console.error(`FAIL: holo mean ${holoMean.toFixed(1)} > ${MAX_HOLO_MEAN} (washed holo)`);
	failed = true;
}
if (failed) process.exit(1);

console.log('PASS: light contrast luminance gates');
