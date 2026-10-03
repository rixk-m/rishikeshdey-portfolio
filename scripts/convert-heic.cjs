/**
 * Cinematography asset pipeline
 * ------------------------------------------------------------
 * Drop photographs into  public/assets/cinematography/originals/
 * (HEIC, JPG/JPEG, ARW supported). Originals are NEVER modified.
 *
 * For every original this script:
 *   1. decodes it (HEIC via heic-decode, JPEG via jpeg-js,
 *      ARW via its embedded full-size JPEG preview)
 *   2. applies the EXIF orientation so nothing renders sideways
 *   3. writes two browser-safe JPEG derivatives to web/:
 *        <name>-1600.jpg  (large, for full-bleed + lightbox)
 *        <name>-640.jpg   (small, for the cursor image trail)
 *   4. regenerates src/data/cinematography.generated.ts with
 *      real dimensions + average colour (used as load placeholder)
 *
 * Video files (mp4/mov/webm/m4v) found directly in
 * public/assets/cinematography/ are registered as the reel as-is.
 * Nothing is trimmed or re-encoded.
 *
 * Derivatives are cached: unchanged originals are skipped.
 */
const fs = require('fs');
const path = require('path');
const decodeHeic = require('heic-decode');
const jpeg = require('jpeg-js');

const ROOT = path.resolve(__dirname, '../public/assets/cinematography');
const ORIGINALS_DIR = path.join(ROOT, 'originals');
const LEGACY_DIR = path.join(ROOT, 'thumbnails');
const WEB_DIR = path.join(ROOT, 'web');
const OUT_TS = path.resolve(__dirname, '../src/data/cinematography.generated.ts');
const CACHE_FILE = path.join(WEB_DIR, '.manifest-cache.json');

const SIZES = [
  { suffix: '1600', max: 1600, quality: 82 },
  { suffix: '640', max: 640, quality: 76 },
];
const IMAGE_EXT = ['.heic', '.heif', '.jpg', '.jpeg', '.arw'];
const VIDEO_EXT = ['.mp4', '.mov', '.webm', '.m4v'];

/* ---------------- EXIF / TIFF orientation ---------------- */
function readTiffOrientation(buf, tiffStart) {
  try {
    const order = buf.toString('ascii', tiffStart, tiffStart + 2);
    const le = order === 'II';
    if (!le && order !== 'MM') return 1;
    const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
    const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
    const ifd = tiffStart + u32(tiffStart + 4);
    const count = u16(ifd);
    for (let i = 0; i < count; i++) {
      const entry = ifd + 2 + i * 12;
      if (u16(entry) === 0x0112) {
        const v = u16(entry + 8);
        return v >= 1 && v <= 8 ? v : 1;
      }
    }
  } catch {
    /* malformed EXIF → assume upright */
  }
  return 1;
}

function jpegOrientation(buf) {
  let o = 2;
  while (o < buf.length - 4) {
    if (buf[o] !== 0xff) return 1;
    const marker = buf[o + 1];
    const len = buf.readUInt16BE(o + 2);
    if (marker === 0xe1 && buf.toString('ascii', o + 4, o + 10) === 'Exif\0\0') {
      return readTiffOrientation(buf, o + 10);
    }
    if (marker === 0xda) return 1; // start of scan, no EXIF found
    o += 2 + len;
  }
  return 1;
}

/* ---------------- ARW embedded preview ---------------- */
function extractArwPreview(buf) {
  // 1) Walk the TIFF IFD chain + SubIFDs and collect JPEG offset/length tags.
  const candidates = [];
  try {
    const le = buf.toString('ascii', 0, 2) === 'II';
    const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
    const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
    const visited = new Set();
    const queue = [u32(4)];
    while (queue.length) {
      const ifd = queue.shift();
      if (!ifd || ifd >= buf.length - 2 || visited.has(ifd)) continue;
      visited.add(ifd);
      const count = u16(ifd);
      let off = 0, len = 0;
      for (let i = 0; i < count; i++) {
        const e = ifd + 2 + i * 12;
        const tag = u16(e);
        if (tag === 0x0201) off = u32(e + 8);
        if (tag === 0x0202) len = u32(e + 8);
        if (tag === 0x014a) {
          const n = u32(e + 4);
          if (n === 1) queue.push(u32(e + 8));
          else for (let k = 0; k < n; k++) queue.push(u32(u32(e + 8) + k * 4));
        }
      }
      if (off && len && off + len <= buf.length && buf[off] === 0xff && buf[off + 1] === 0xd8) {
        candidates.push(buf.subarray(off, off + len));
      }
      queue.push(u32(ifd + 2 + count * 12));
    }
  } catch {
    /* fall through to scan */
  }
  if (candidates.length) return candidates.sort((a, b) => b.length - a.length)[0];

  // 2) Fallback: biggest gap between consecutive JPEG SOI markers.
  const starts = [];
  for (let i = 0; i < buf.length - 3; i++) {
    if (buf[i] === 0xff && buf[i + 1] === 0xd8 && buf[i + 2] === 0xff) starts.push(i);
  }
  let best = null;
  starts.forEach((s, i) => {
    const end = i + 1 < starts.length ? starts[i + 1] : buf.length;
    if (!best || end - s > best.length) best = buf.subarray(s, end);
  });
  return best;
}

/* ---------------- pixel helpers ---------------- */
function downscale(src, w, h, max) {
  const scale = Math.min(1, max / Math.max(w, h));
  const tw = Math.max(1, Math.round(w * scale));
  const th = Math.max(1, Math.round(h * scale));
  if (scale === 1) return { data: src, width: w, height: h };
  const out = Buffer.alloc(tw * th * 4);
  const sx = w / tw;
  const sy = h / th;
  for (let y = 0; y < th; y++) {
    const y0 = Math.floor(y * sy);
    const y1 = Math.min(h, Math.max(y0 + 1, Math.floor((y + 1) * sy)));
    for (let x = 0; x < tw; x++) {
      const x0 = Math.floor(x * sx);
      const x1 = Math.min(w, Math.max(x0 + 1, Math.floor((x + 1) * sx)));
      let r = 0, g = 0, b = 0, n = 0;
      for (let yy = y0; yy < y1; yy++) {
        let p = (yy * w + x0) * 4;
        for (let xx = x0; xx < x1; xx++, p += 4) {
          r += src[p]; g += src[p + 1]; b += src[p + 2]; n++;
        }
      }
      const q = (y * tw + x) * 4;
      out[q] = r / n; out[q + 1] = g / n; out[q + 2] = b / n; out[q + 3] = 255;
    }
  }
  return { data: out, width: tw, height: th };
}

function orient(img, orientation) {
  if (orientation === 1) return img;
  const { data, width: w, height: h } = img;
  const swap = orientation >= 5;
  const W = swap ? h : w;
  const H = swap ? w : h;
  const out = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sx, sy;
      switch (orientation) {
        case 2: sx = w - 1 - x; sy = y; break;
        case 3: sx = w - 1 - x; sy = h - 1 - y; break;
        case 4: sx = x; sy = h - 1 - y; break;
        case 5: sx = y; sy = x; break;
        case 6: sx = y; sy = h - 1 - x; break;
        case 7: sx = w - 1 - y; sy = h - 1 - x; break;
        case 8: sx = w - 1 - y; sy = x; break;
        default: sx = x; sy = y;
      }
      const s = (sy * w + sx) * 4;
      const d = (y * W + x) * 4;
      out[d] = data[s]; out[d + 1] = data[s + 1]; out[d + 2] = data[s + 2]; out[d + 3] = 255;
    }
  }
  return { data: out, width: W, height: H };
}

function averageColor(img) {
  const { data } = img;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += 4 * 16) {
    r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
  }
  const hex = (v) => Math.round(v / n).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/* ---------------- decode any supported original ---------------- */
async function decodeOriginal(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const buf = fs.readFileSync(filePath);
  if (ext === '.heic' || ext === '.heif') {
    // heic-decode returns display-oriented RGBA pixels.
    const { width, height, data } = await decodeHeic({ buffer: buf });
    return { img: { data: Buffer.from(data.buffer, data.byteOffset, data.byteLength), width, height }, orientation: 1 };
  }
  if (ext === '.arw') {
    const preview = extractArwPreview(buf);
    if (!preview) throw new Error('no embedded JPEG preview');
    const d = jpeg.decode(preview, { useTArray: true, formatAsRGBA: true, maxMemoryUsageInMB: 2048 });
    return { img: { data: d.data, width: d.width, height: d.height }, orientation: readTiffOrientation(buf, 0) };
  }
  const d = jpeg.decode(buf, { useTArray: true, formatAsRGBA: true, maxMemoryUsageInMB: 2048 });
  return { img: { data: d.data, width: d.width, height: d.height }, orientation: jpegOrientation(buf) };
}

/* ---------------- main ---------------- */
function listOriginals() {
  const seen = new Set();
  const files = [];
  for (const dir of [ORIGINALS_DIR, LEGACY_DIR]) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
      const ext = path.extname(f).toLowerCase();
      if (!IMAGE_EXT.includes(ext)) continue;
      const id = slug(path.basename(f, path.extname(f)));
      if (seen.has(id)) continue; // originals/ wins over legacy duplicates
      seen.add(id);
      files.push({ id, file: f, full: path.join(dir, f), rel: path.relative(ROOT, path.join(dir, f)).split(path.sep).join('/') });
    }
  }
  return files;
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function run() {
  fs.mkdirSync(WEB_DIR, { recursive: true });
  const cache = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) : {};
  const nextCache = {};
  const photos = [];
  const keep = new Set(['.manifest-cache.json']);

  for (const o of listOriginals()) {
    const mtime = fs.statSync(o.full).mtimeMs;
    const outs = SIZES.map((s) => `${o.id}-${s.suffix}.jpg`);
    outs.forEach((f) => keep.add(f));
    const cached = cache[o.id];
    const fresh = cached && cached.mtime === mtime && outs.every((f) => fs.existsSync(path.join(WEB_DIR, f)));

    let meta = fresh ? cached : null;
    if (!meta) {
      process.stdout.write(`[cinematography] processing ${o.file} … `);
      try {
        const { img, orientation } = await decodeOriginal(o.full);
        let dims = null;
        let color = '#1e1f1e';
        for (const s of SIZES) {
          const small = orient(downscale(img.data, img.width, img.height, s.max), orientation);
          const enc = jpeg.encode({ data: small.data, width: small.width, height: small.height }, s.quality);
          fs.writeFileSync(path.join(WEB_DIR, `${o.id}-${s.suffix}.jpg`), enc.data);
          if (!dims) dims = { width: small.width, height: small.height };
          if (s.suffix === '640') color = averageColor(small);
        }
        meta = { mtime, ...dims, color };
        console.log(`ok ${dims.width}x${dims.height} (orientation ${orientation})`);
      } catch (err) {
        console.log(`skipped (${err.message})`);
        continue; // never ship a broken asset
      }
    }
    nextCache[o.id] = meta;
    photos.push({
      id: o.id,
      src: `/assets/cinematography/web/${o.id}-1600.jpg`,
      srcSmall: `/assets/cinematography/web/${o.id}-640.jpg`,
      original: `/assets/cinematography/${o.rel}`,
      width: meta.width,
      height: meta.height,
      color: meta.color,
    });
  }

  // Remove stale derivatives (only inside web/, never originals).
  for (const f of fs.readdirSync(WEB_DIR)) {
    if (!keep.has(f)) fs.unlinkSync(path.join(WEB_DIR, f));
  }
  fs.writeFileSync(CACHE_FILE, JSON.stringify(nextCache, null, 2));

  const videos = fs
    .readdirSync(ROOT)
    .filter((f) => VIDEO_EXT.includes(path.extname(f).toLowerCase()) && fs.statSync(path.join(ROOT, f)).isFile())
    .map((f) => `/assets/cinematography/${f}`);

  const ts = `/* AUTO-GENERATED by scripts/convert-heic.cjs — do not edit by hand.
 * Add photographs to public/assets/cinematography/originals/ and run
 * \`npm run convert:heic\` (also runs automatically on \`npm run build\`). */

export interface GeneratedPhoto {
  id: string;
  /** 1600px JPEG derivative */
  src: string;
  /** 640px JPEG derivative */
  srcSmall: string;
  /** untouched original file */
  original: string;
  width: number;
  height: number;
  /** average colour, used as loading placeholder */
  color: string;
}

export const generatedPhotos: GeneratedPhoto[] = ${JSON.stringify(photos, null, 2)};

export const generatedVideos: string[] = ${JSON.stringify(videos, null, 2)};
`;
  fs.writeFileSync(OUT_TS, ts);
  console.log(`[cinematography] ${photos.length} photos, ${videos.length} video(s) → ${path.relative(process.cwd(), OUT_TS)}`);
}

run().catch((err) => {
  console.error('[cinematography] failed:', err);
  process.exit(1);
});
