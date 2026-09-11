import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ImageAsset } from '@/data/media';

interface EditorialImageProps {
  asset: ImageAsset;
  /** Tailwind aspect-ratio classes. Set a different ratio per breakpoint where a tall crop would eat the mobile viewport. */
  aspectClassName?: string;
  className?: string;
  /** `eager` for anything above the fold; everything else stays lazy. */
  loading?: 'eager' | 'lazy';
  /** Passed through to `object-position` so a crop can favour the subject rather than the geometric centre. */
  objectPositionClassName?: string;
}

/**
 * The only place a photograph is rendered.
 *
 * Handles the three states an image actually has in production, so a
 * missing or slow asset never looks like a bug:
 *   - unfilled (`src: null`) — renders a designed paper-and-brass plate
 *   - failed to load — same plate, via onError
 *   - loading — the plate shows first and the photograph fades over it
 *
 * Intrinsic width/height come from the asset so the browser reserves the
 * right box before the image arrives; without that, every image on the
 * page is a layout shift.
 */
export function EditorialImage({
  asset,
  aspectClassName = 'aspect-[4/5]',
  className,
  loading = 'lazy',
  objectPositionClassName = 'object-center',
}: EditorialImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>(asset.src ? 'loading' : 'failed');
  const showPlate = status !== 'loaded';

  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-surface-2', aspectClassName, className)}>
      {showPlate && <ImagePlate />}

      {asset.src && status !== 'failed' && (
        <img
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          loading={loading}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('failed')}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            objectPositionClassName,
            'transition-opacity duration-700 ease-signature',
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
}

/**
 * Designed stand-in for an image slot: layered paper tones with a brass
 * arc. Decorative and hidden from assistive tech — the surrounding content
 * always carries the meaning, so nothing is lost when a photograph isn't
 * there.
 */
function ImagePlate() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-surface-2">
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <linearGradient id="editorial-plate-wash" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="rgb(var(--color-brass))" stopOpacity="0.14" />
            <stop offset="100%" stopColor="rgb(var(--color-accent-primary))" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#editorial-plate-wash)" />
        <path
          d="M-40 380 C 90 300, 150 330, 250 250 S 380 120, 460 90"
          fill="none"
          stroke="rgb(var(--color-brass))"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
        <path
          d="M-40 440 C 90 360, 150 390, 250 310 S 380 180, 460 150"
          fill="none"
          stroke="rgb(var(--color-accent-primary))"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
