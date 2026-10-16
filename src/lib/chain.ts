export function hash32(input: string): number {
	let h = 0x811c9dc5;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}

export function shortHash(input: string): string {
	const a = hash32(input).toString(16).padStart(8, '0');
	const b = hash32(`${input}:tail`).toString(16).padStart(8, '0');
	return `0x${a.slice(0, 4)}…${b.slice(-4)}`;
}

/** Deterministic 0–1 generator (mulberry32). */
export function seeded(seed: string): () => number {
	let a = hash32(seed);
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const palette = ['#1e56f0', '#4d7dff', '#8fb3ff', '#c9d8ff'];

export type IdenticonCell = { x: number; y: number; fill: string };

/** 5×5 mirrored grid, blockies-style. */
export function identicon(seed: string, colors: readonly string[] = palette): IdenticonCell[] {
	const h = hash32(seed);
	const h2 = hash32(`${seed}:color`);
	const cells: IdenticonCell[] = [];
	for (let y = 0; y < 5; y++) {
		for (let x = 0; x < 3; x++) {
			const bit = y * 3 + x;
			if (((h >>> bit) & 1) === 0) continue;
			const fill = colors[((h2 >>> (bit * 2)) & 3) % colors.length];
			cells.push({ x, y, fill });
			if (x < 2) cells.push({ x: 4 - x, y, fill });
		}
	}
	return cells;
}
