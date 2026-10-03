/**
 * Cinematography data
 * ------------------------------------------------------------
 * Photos + reel come from the generated manifest
 * (scripts/convert-heic.cjs → cinematography.generated.ts).
 *
 * To add photographs: drop files (HEIC / JPG / ARW) into
 * public/assets/cinematography/originals/ and run `npm run convert:heic`
 * (runs automatically on `npm run build`). Browser-safe JPEG
 * derivatives are written to /web and picked up here automatically —
 * every layout in the cinematography world adapts to the count.
 *
 * No titles, places, dates or credits are invented here — the only
 * metadata shown is what really exists: sequence number, count and
 * the photo's real orientation.
 */
import { generatedPhotos, generatedVideos, type GeneratedPhoto } from './cinematography.generated';

export type PlateLayout = 'bleed' | 'left' | 'right' | 'portrait';

export interface CinePhoto extends GeneratedPhoto {
  /** 1-based position in the sequence */
  n: number;
  /** zero-padded label, e.g. "01" */
  label: string;
  ratio: number;
  portrait: boolean;
  /** composition used for this plate in the scroll sequence */
  layout: PlateLayout;
}

/** Landscape compositions cycle; portraits always get a tall centred plate. */
const LANDSCAPE_CYCLE: PlateLayout[] = ['bleed', 'left', 'right'];

let landscapeIndex = 0;
export const cinePhotos: CinePhoto[] = generatedPhotos.map((p, i) => {
  const ratio = p.width / p.height;
  const portrait = ratio < 1;
  const layout: PlateLayout = portrait ? 'portrait' : LANDSCAPE_CYCLE[landscapeIndex++ % LANDSCAPE_CYCLE.length];
  return { ...p, n: i + 1, label: String(i + 1).padStart(2, '0'), ratio, portrait, layout };
});

export const cineCount = cinePhotos.length;
export const cineCountLabel = String(cineCount).padStart(2, '0');

/** First landscape photo opens the world (it expands to full-bleed). */
export const cineOpening: CinePhoto | undefined = cinePhotos.find((p) => !p.portrait) ?? cinePhotos[0];

/** Every other photo becomes a plate in the scroll sequence. */
export const cinePlates: CinePhoto[] = cinePhotos.filter((p) => p !== cineOpening);

/** The final, manually trimmed reel. Played exactly as delivered. */
export const cineReelSrc: string | null =
  generatedVideos.find((v) => /showreel/i.test(v)) ?? generatedVideos[0] ?? null;

/** Editorial copy (no invented facts). */
export const cineCopy = {
  title: ['Cinema', 'tography'] as const,
  enter: 'Enter',
  back: 'Back to portfolio',
  statementLabel: 'Statement',
  statement:
    'A personal archive of light, motion and visual narrative. Every frame is a choice — light, composition, timing — the invisible decisions that make an image feel alive.',
  reelLabel: 'Reel',
  outro: ['See', 'differently'] as const,
};
