import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const MODEL_SRC = "/models/pistol.glb";
const POSTER_SRC = "/posters/pistol.webp";

export default function Showcase3D() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const mvRef = useRef<any>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const cb = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", cb);
    return () => mq.removeEventListener?.("change", cb);
  }, []);

  useEffect(() => {
    const el = mvRef.current as any;
    if (!el) return;
    const onLoad = () => {
      try {
        const clips: string[] = el.availableAnimations ?? [];
        if (clips.length > 0) {
          el.animationName = clips[0];
          if (!reducedMotion) el.play();
        }
      } catch {}
    };
    el.addEventListener?.("load", onLoad);
    return () => el.removeEventListener?.("load", onLoad);
  }, [reducedMotion]);

  useEffect(() => {
    const el = parallaxRef.current;
    if (!el || reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const rx = (e.clientX - r.left) / r.width;
      const ry = (e.clientY - r.top) / r.height;
      setParallax({ x: (rx - 0.5) * 40, y: (ry - 0.5) * 40 });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  return (
    <section
      id="showcase3d"
      ref={parallaxRef}
      // mais alto, com respiro na base e sem ficar atrás do header
      className="relative w-full min-h-[86vh] bg-black overflow-hidden pt-24 md:pt-28 pb-16 md:pb-24 scroll-mt-28"
    >
      {/* FUNDOS */}
      <div className="absolute inset-0 pointer-events-none">
        {/* fade vertical sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-[#0f0f0f]" />
        {/* cinza puxando pro lado da arma */}
        <div className="absolute inset-0 bg-gradient-to-l from-neutral-900/70 via-transparent to-transparent" />
        {/* glow radial maior, alinhado ao novo enquadramento */}
        <div
          className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[78vw] max-w-[1100px] aspect-[1.6/1] rounded-full"
          style={{
            background:
              "radial-gradient(55% 60% at 70% 50%, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 60%, rgba(0,0,0,0) 75%)",
            filter: "blur(70px)",
            transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
            transition: "transform 80ms linear",
          }}
        />
      </div>

      {/* MODELO 3D — maior e mais à direita */}
      <div className="absolute inset-0">
        {/* @ts-ignore: web component */}
        <model-viewer
          ref={mvRef}
          src={MODEL_SRC}
          poster={POSTER_SRC}
          autoplay
          loop
          {...(!reducedMotion ? { "auto-rotate": true } : {})}
          camera-controls
          interaction-prompt="auto"
          exposure={1}
          shadow-intensity={1}
          aria-label="Animação 3D de pistola em destaque"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            backgroundColor: "transparent",
            objectFit: "cover",
            touchAction: "pan-y",
            cursor: "grab",
            // 👇 aumenta e desloca o GLB pro canto direito
            transform: "translateX(25%) scale(1.25)",
            transformOrigin: "right center",
          }}
        />
      </div>

      {/* TEXTO — container colado na lateral, texto onde estava */}
      <div className="relative z-10 h-full flex items-center pointer-events-none">
        {/* container colado, sem padding; o offset é na própria box de texto */}
        <div className="w-full">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -24 }}
            animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            // offset controlado por margens, mantendo o “canto” colado
            className="ml-6 sm:ml-10 md:ml-16 lg:ml-24 max-w-xl pointer-events-auto"
          >
            <h1 className="relative text-texture-cimento text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05]">
              Treine com segurança.<br />Domine a técnica.<br />Preserve vidas.
            </h1>
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="mt-6 text-base sm:text-lg text-white/85 max-w-md"
            >
              Escola de tiro profissional com instrutores experientes e estrutura
              completa para seu desenvolvimento.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
