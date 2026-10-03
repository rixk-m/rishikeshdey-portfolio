import type { ReactNode, ImgHTMLAttributes } from 'react';
import './MediaFrame.css';

type AspectRatio = '16x9' | '4x3' | '3x2' | '1x1' | 'auto';

interface MediaFrameProps {
  /** Image source */
  src?: string;
  /** Image alt text (required when src is used) */
  alt?: string;
  /** Aspect ratio preset */
  ratio?: AspectRatio;
  /** Remove border radius */
  flush?: boolean;
  /** Show gradient overlay */
  overlay?: boolean;
  /** Caption text */
  caption?: string;
  /** Children for custom media content (e.g., video) */
  children?: ReactNode;
  /** Additional image attributes */
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
  className?: string;
}

export default function MediaFrame({
  src,
  alt = '',
  ratio = '16x9',
  flush = false,
  overlay = false,
  caption,
  children,
  imgProps,
  className = '',
}: MediaFrameProps) {
  const classes = [
    'media-frame',
    `media-frame--${ratio}`,
    flush ? 'media-frame--flush' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          {...imgProps}
        />
      ) : (
        children
      )}
      {overlay && <div className="media-frame__overlay" />}
      {caption && (
        <span className="media-frame__caption">{caption}</span>
      )}
    </div>
  );
}
