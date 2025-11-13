// src/types/model-viewer.d.ts
import type React from "react";

// Tipos mínimos úteis do <model-viewer> para nosso uso
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        // fontes
        src?: string;
        poster?: string;

        // interação/controles
        "camera-controls"?: boolean;
        "disable-zoom"?: boolean;
        "interaction-prompt"?: "auto" | "none";

        // animação
        "auto-rotate"?: boolean;

        // visual
        exposure?: number | string;
        "shadow-intensity"?: number | string;

        // acessibilidade
        "aria-label"?: string;

        // extras comuns
        "environment-image"?: string;
        "camera-orbit"?: string;
        "field-of-view"?: string;
        "alt"?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

export {};
