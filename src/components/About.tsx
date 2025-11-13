import { Shield, Users, FileCheck } from "lucide-react";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const About = () => {
  const { ref, isVisible } = useIntersectionReveal();

  // texto que vai “passar” como vídeo
  const paragraphs = [
    "A G-TACTICAL é uma escola de tiro comprometida com a excelência técnica e a segurança absoluta em cada treinamento. Nossa metodologia combina fundamentos sólidos com cenários práticos realistas.",
    "Acreditamos que o domínio responsável de técnicas de tiro vai além da precisão: envolve consciência situacional, controle emocional e decisões éticas sob pressão.",
    "Cada curso é estruturado para desenvolver não apenas habilidades técnicas, mas também a mentalidade necessária para agir com segurança e confiança em situações críticas.",
  ];

  const [idx, setIdx] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;

    const id = setInterval(() => setIdx((i) => (i + 1) % paragraphs.length), 3500);
    return () => clearInterval(id);
  }, []);

  const trustPoints = [
    {
      icon: Users,
      title: "Instrutores Experientes",
      description: "Profissionais com experiência operacional e certificações",
    },
    {
      icon: Shield,
      title: "Estrutura Controlada",
      description: "Ambiente seguro com todos os EPIs necessários",
    },
    {
      icon: FileCheck,
      title: "Suporte Documental",
      description: "Assessoria Documental Ribas para questões jurídicas",
    },
  ];

  return (
    <section
      id="sobre"
      ref={ref}
      className={cn("py-20 bg-background", isVisible && "reveal-in")}
    >
      <div className="container mx-auto px-4">
        {/* Cabeçalho */}
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            TREINAMENTO, RESPONSABILIDADE E SEGURANÇA
          </h2>

          {/* Estilo vídeo: um parágrafo por vez no MESMO lugar */}
          {!reduced ? (
            <div
              className="relative mt-6 mx-auto max-w-[78ch] h-[120px] sm:h-[110px] md:h-[100px]"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute inset-0 text-lg text-white/80 leading-relaxed"
                  style={{ display: "grid", placeItems: "center" }}
                >
                  {paragraphs[idx]}
                </motion.p>
              </AnimatePresence>
            </div>
          ) : (
            // fallback acessível: tudo estático quando usuário prefere menos movimento
            <div className="mt-6 space-y-4 text-lg text-white/80 leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </div>

        {/* Trust Points — prata */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition-colors hover:bg-white/[0.05]"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#D9D9D9]/15 border border-[#D9D9D9]/30 mb-4">
                  <Icon className="h-7 w-7 text-[#E5E5E5]" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2 text-white">
                  {point.title}
                </h3>
                <p className="text-white/70">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
