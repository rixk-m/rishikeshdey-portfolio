import { useEffect, useRef } from 'react';
import { cinePhotos, type CinePhoto } from '../../data/cinematography';
import { useFinePointer, useReducedMotion } from './scroll';
import './ImageTrail.css';

/**
 * High-performance cursor image trail replicating the signature
 * Matter-of-Mind (https://matter-of-mind.fr/) 3D photo ribbon aesthetic.
 *
 * Key characteristics:
 * - Uniform 3:4 portrait card aspect ratio for a cohesive cascading deck
 * - 3D banking and aerodynamic momentum along cursor trajectory
 * - 50-card circular pool for an unbroken, 2.8s lingering ribbon
 * - Direct 60/120fps RAF loop with zero React reconciliation overhead
 * - Automatic sleep when cards are inactive (0% idle CPU)
 * - Pure pointer-events: none to preserve all underlying click/keyboard triggers
 */

const POOL_SIZE = 50; // Dense capacity so fast sweeps never cut off older cards
const DISTANCE_THRESHOLD = 32; // Smooth, responsive ribbon spacing matching Matter of Mind
const CARD_DURATION_MS = 2800; // Luxurious lingering lifecycle

interface CardInstance {
  el: HTMLDivElement;
  img: HTMLImageElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotZ: number;
  rotY: number;
  rotX: number;
  bornAt: number;
  active: boolean;
  photo: CinePhoto;
}

export default function ImageTrail({ disabled = false }: { disabled?: boolean }) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<CardInstance[]>([]);
  const poolIndexRef = useRef(0);
  const photoIndexRef = useRef(0);
  const zCounterRef = useRef(10);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const rafIdRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (disabled || reduced || !fine) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
      isRunningRef.current = false;
      lastPosRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      poolRef.current = [];
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const parent = container.parentElement;
    if (!parent) return;

    // Reset loop state on mount/re-enable
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    }
    isRunningRef.current = false;
    lastPosRef.current = null;

    // Pre-create high-performance DOM pool
    container.innerHTML = '';
    const pool: CardInstance[] = [];

    for (let i = 0; i < POOL_SIZE; i++) {
      const el = document.createElement('div');
      el.className = 'cine-trail__card';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';

      const img = document.createElement('img');
      img.alt = '';
      img.draggable = false;
      img.decoding = 'async';
      el.appendChild(img);

      container.appendChild(el);

      pool.push({
        el,
        img,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rotZ: 0,
        rotY: 0,
        rotX: 0,
        bornAt: 0,
        active: false,
        photo: cinePhotos[0],
      });
    }

    poolRef.current = pool;

    // Dedicated 60/120fps RAF animation loop (zero React reconciliation overhead)
    const animate = (now: number) => {
      let anyActive = false;

      for (let i = 0; i < pool.length; i++) {
        const card = pool[i];
        if (!card.active) continue;

        const age = now - card.bornAt;
        const p = age / CARD_DURATION_MS;

        if (p >= 1) {
          card.active = false;
          card.el.style.opacity = '0';
          continue;
        }

        anyActive = true;

        // Apply physical momentum with aerodynamic damping
        card.x += card.vx;
        card.y += card.vy;
        card.vx *= 0.95;
        card.vy *= 0.95;

        // Continuous subtle 3D relaxation
        card.rotY *= 0.985;
        card.rotX *= 0.985;

        // Subtle 3D Z-parallax — pops forward slightly then sinks
        const zDepth = Math.sin(p * Math.PI) * 18;

        // Matter-of-Mind signature faded aesthetic:
        // Translucent cards that progressively dissolve along the trail ribbon
        const PEAK_OPACITY = 0.82;
        let opacity = 0;
        let scale = 1;
        let driftY = 0;

        if (p < 0.10) {
          // Soft cubic emergence towards translucent peak
          const t = p / 0.10;
          const ease = 1 - Math.pow(1 - t, 3);
          scale = 0.90 + 0.10 * ease;
          opacity = PEAK_OPACITY * ease;
        } else if (p < 0.32) {
          // Lingering floating phase with gentle initial fade (0.82 -> 0.70)
          const t = (p - 0.10) / 0.22;
          scale = 1.0;
          opacity = PEAK_OPACITY - 0.12 * t;
        } else {
          // Continuous, graceful faded dissolve into the dark backdrop (0.70 -> 0.0)
          const t = (p - 0.32) / 0.68;
          const fade = Math.pow(1 - t, 1.45);
          opacity = 0.70 * fade;
          scale = 1.0 - 0.05 * t;
          driftY = t * 14;
        }

        const curY = card.y + driftY;
        card.el.style.transform = `translate3d(${card.x.toFixed(1)}px, ${curY.toFixed(1)}px, ${zDepth.toFixed(1)}px) translate(-50%, -50%) rotateZ(${card.rotZ.toFixed(2)}deg) rotateY(${card.rotY.toFixed(2)}deg) rotateX(${card.rotX.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.el.style.opacity = opacity.toFixed(3);
      }

      if (anyActive) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        isRunningRef.current = false;
      }
    };

    const startLoop = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Discard movements outside reasonable bounds
      if (x < -60 || x > rect.width + 60 || y < -60 || y > rect.height + 60) return;

      if (!lastPosRef.current) {
        lastPosRef.current = { x, y };
        return;
      }

      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist >= DISTANCE_THRESHOLD) {
        lastPosRef.current = { x, y };

        const photo = cinePhotos[photoIndexRef.current % cinePhotos.length];
        photoIndexRef.current++;

        const card = pool[poolIndexRef.current % POOL_SIZE];
        poolIndexRef.current++;

        // Compute normalized trajectory & directional 3D banking (Matter of Mind formula)
        const speed = Math.max(dist, 1);
        const dirX = dx / speed;
        const dirY = dy / speed;

        // In-plane roll: directional tilt + subtle organic imperfection
        const rotZ = dirX * 9 + (Math.random() - 0.5) * 8;
        // 3D Banking: turn towards velocity vector
        const rotY = Math.max(-22, Math.min(22, dirX * 18));
        // Pitch: dip forward/backward with stroke
        const rotX = Math.max(-16, Math.min(16, -dirY * 15));

        // Initial momentum carry-over
        const carry = Math.min(dist * 0.12, 6);
        card.vx = dirX * carry;
        card.vy = dirY * carry;

        card.x = x;
        card.y = y;
        card.rotZ = rotZ;
        card.rotY = rotY;
        card.rotX = rotX;
        card.bornAt = performance.now();
        card.active = true;
        card.photo = photo;

        card.img.src = photo.srcSmall;
        card.el.style.zIndex = String(zCounterRef.current++);

        startLoop();
      }
    };

    const onPointerLeave = () => {
      lastPosRef.current = null;
    };

    parent.addEventListener('pointermove', onPointerMove, { passive: true });
    parent.addEventListener('pointerleave', onPointerLeave);

    return () => {
      parent.removeEventListener('pointermove', onPointerMove);
      parent.removeEventListener('pointerleave', onPointerLeave);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
      isRunningRef.current = false;
      lastPosRef.current = null;
      container.innerHTML = '';
      poolRef.current = [];
    };
  }, [disabled, fine, reduced]);

  if (reduced || !fine) return null;

  return (
    <div
      ref={containerRef}
      className="cine-trail"
      aria-hidden="true"
      style={{ display: disabled ? 'none' : 'block' }}
    />
  );
}
