// Dependency-free PWA icon generator.
// Draws the Grip dumbbell mark on a dark rounded/full-bleed background and
// writes RGBA PNGs using Node's built-in zlib (no image libraries required).
//
// Usage: node scripts/gen-icons.mjs

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'static', 'icons');

const BG = [15, 15, 16]; // #0f0f10
const ACCENT = [198, 255, 0]; // #c6ff00

// ---- geometry (32x32 design space) ----
const DUMBBELL = [
	// [x0, y0, x1, y1, radius] rounded rects
	[10.5, 12.5, 21.5, 19.5, 2.2], // center handle
	[4.7, 13.5, 7.3, 18.5, 1.3], // left inner plate
	[7.2, 11, 9.8, 21, 1.3], // left outer plate
	[24.7, 13.5, 27.3, 18.5, 1.3], // right inner plate
	[22.2, 11, 24.8, 21, 1.3] // right outer plate
];

function inRoundedRect(x, y, x0, y0, x1, y1, r) {
	if (x < x0 || x > x1 || y < y0 || y > y1) return false;
	const nx = Math.max(x0 + r, Math.min(x, x1 - r));
	const ny = Math.max(y0 + r, Math.min(y, y1 - r));
	const dx = x - nx;
	const dy = y - ny;
	return dx * dx + dy * dy <= r * r;
}

function inDumbbell(x, y) {
	for (const r of DUMBBELL) if (inRoundedRect(x, y, ...r)) return true;
	return false;
}

function inBackground(x, y, rounded) {
	if (!rounded) return true;
	const r = 7.2; // corner radius of the app icon square
	return inRoundedRect(x, y, 0, 0, 32, 32, r);
}

// ---- PNG encoding ----
const CRC_TABLE = (() => {
	const t = [];
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		t[n] = c;
	}
	return t;
})();

function crc32(buf) {
	let c = 0xffffffff;
	for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
	const len = Buffer.alloc(4);
	len.writeUInt32BE(data.length);
	const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(body));
	return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
	const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 8; // bit depth
	ihdr[9] = 6; // color type RGBA
	const raw = Buffer.alloc((width * 4 + 1) * height);
	for (let y = 0; y < height; y++) {
		raw[y * (width * 4 + 1)] = 0; // filter: none
		rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
	}
	const idat = deflateSync(raw, { level: 9 });
	return Buffer.concat([
		signature,
		chunk('IHDR', ihdr),
		chunk('IDAT', idat),
		chunk('IEND', Buffer.alloc(0))
	]);
}

// ---- rendering ----
// opts: { size, rounded, centerScale }
function renderIcon({ size, rounded, centerScale = 1 }) {
	const SS = 4; // supersample
	const scale = size / 32;
	const rgba = Buffer.alloc(size * size * 4);
	for (let py = 0; py < size; py++) {
		for (let px = 0; px < size; px++) {
			let nBg = 0;
			let nAcc = 0;
			for (let sy = 0; sy < SS; sy++) {
				for (let sx = 0; sx < SS; sx++) {
					const fx = ((px + (sx + 0.5) / SS) / size) * 32;
					const fy = ((py + (sy + 0.5) / SS) / size) * 32;
					if (!inBackground(fx, fy, rounded)) continue;
					nBg++;
					// map into (possibly scaled, centered) dumbbell space
					const dx = (fx - 16) / centerScale + 16;
					const dy = (fy - 16) / centerScale + 16;
					if (inDumbbell(dx, dy)) nAcc++;
				}
			}
			const i = (py * size + px) * 4;
			const a = nBg / (SS * SS);
			if (a <= 0) {
				rgba[i] = rgba[i + 1] = rgba[i + 2] = rgba[i + 3] = 0;
			} else {
				const t = nAcc / nBg;
				rgba[i] = Math.round(BG[0] + (ACCENT[0] - BG[0]) * t);
				rgba[i + 1] = Math.round(BG[1] + (ACCENT[1] - BG[1]) * t);
				rgba[i + 2] = Math.round(BG[2] + (ACCENT[2] - BG[2]) * t);
				rgba[i + 3] = Math.round(a * 255);
			}
		}
	}
	return encodePng(size, size, rgba);
}

mkdirSync(OUT, { recursive: true });

const icons = [
	['icon-192.png', { size: 192, rounded: true, centerScale: 1 }],
	['icon-512.png', { size: 512, rounded: true, centerScale: 1 }],
	['maskable-512.png', { size: 512, rounded: false, centerScale: 0.62 }],
	['apple-touch-icon.png', { size: 180, rounded: false, centerScale: 0.85 }]
];

for (const [name, opts] of icons) {
	writeFileSync(join(OUT, name), renderIcon(opts));
	console.log('wrote', join('static', 'icons', name));
}
