/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': ModelViewerJSX & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

interface ModelViewerJSX {
  src?: string;
  poster?: string;
  alt?: string;
  'auto-rotate'?: boolean;
  'auto-rotate-delay'?: string;
  'rotation-per-second'?: string;
  'camera-controls'?: boolean;
  'disable-zoom'?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onError?: () => void;
  'aria-hidden'?: string | boolean;
}
