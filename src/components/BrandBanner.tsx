import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";
import { trackCTAClick, trackWhatsAppClick } from "@/lib/analytics";

export default function BrandBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [shine, setShine] = useState({ x: "50%", y: "50%" });

  // parallax leve do brilho metálico
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      setShine({ x: `${x}%`, y: `${y}%` });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const toInscricao = () => {
    trackCTAClick("BrandBanner CTA", "#inscricao");
    document.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth" });
  };
  const toCursos = () => {
    trackCTAClick("BrandBanner Secondary", "#cursos");
    document.getElementById("cursos")?.scrollIntoView({ behavior: "smooth" });
  };
  const toWhats = () => {
    trackWhatsAppClick("BrandBanner");
    window.open(WHATSAPP_LINK, "_blank");
  };

  return (
    <section className="relative w-full bg-black border-t border-white/10 py-14 md:py-18">
      <div ref={ref} className="max-w-5xl mx-auto px-6 text-center">
        {/* Logo */}
        <img
          src="/logo.svg"
          alt="G-TACTICAL"
          className="mx-auto mb-4 h-10 md:h-12 w-auto"
          loading="lazy"
        />

        {/* Lema com fonte gotisch + metálico */}
        <h2
          className="font-gotisch text-metallic text-3xl md:text-4xl lg:text-[44px] leading-tight"
          style={{ ["--shineX" as any]: shine.x, ["--shineY" as any]: shine.y }}
        >
          Fraternintas Honor et libertas
        </h2>

       <p className="mt-4 text-white/80 max-w-3xl mx-auto">
  Disciplina, técnica e responsabilidade
  <br />
  uma cultura construída dentro do estande e levada para a vida.
</p>


        {/* CTAs em cinza/branco/quase preto */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={toInscricao}
            className="bg-[#0f0f10] text-white border border-white/15 hover:bg-[#141416] hover:border-white/25 px-8"
          >
            Quero me inscrever
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={toCursos}
            className="border-white/50 text-white hover:bg-white/10 px-8"
          >
            Ver cursos
          </Button>
        </div>
      </div>
    </section>
  );
}
