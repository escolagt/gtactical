import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const IMAGE_SRC = "/posters/caveira.png"; // ajuste o path se estiver em outro lugar

export default function Showcase3D() {
  const [reducedMotion, setReducedMotion] = useState(false);
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
      className="relative w-full min-h-[86vh] bg-black overflow-hidden pt-24 md:pt-28 pb-16 md:pb-24 scroll-mt-28"
    >
      {/* FUNDOS */}
      <div className="absolute inset-0 pointer-events-none">
        {/* fade vertical */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-[#0f0f0f]" />
        {/* lateral cinza */}
        <div className="absolute inset-0 bg-gradient-to-l from-neutral-900/70 via-transparent to-transparent" />
        {/* glow radial com parallax */}
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

      {/* IMAGEM DA CAVEIRA */}
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: 60, scale: 0.9 }}
          animate={
            reducedMotion
              ? { opacity: 1, x: 0, scale: 1 }
              : {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  y: [0, -10, 0], // flutuação suave
                }
          }
          transition={
            reducedMotion
              ? { duration: 0.8, ease: "easeOut" }
              : {
                  opacity: { duration: 0.8, ease: "easeOut" },
                  x: { duration: 0.8, ease: "easeOut" },
                  scale: { duration: 0.8, ease: "easeOut" },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  },
                }
          }
          className="relative w-[68vw] max-w-[790px] mr-[-6vw] md:mr-[-4vw] lg:mr-[-2vw]"
          style={{
            transformOrigin: "right center",
          }}
        >
          <div className="pointer-events-auto">
            <img
              src={IMAGE_SRC}
              alt="Caveira tática da G-TACTICAL em destaque"
              className="w-full h-auto object-contain select-none"
              draggable={false}
            />
          </div>
        </motion.div>
      </div>

      {/* TEXTO */}
      <div className="relative z-10 h-full flex items-center pointer-events-none">
        <div className="w-full">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -24 }}
            animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
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
