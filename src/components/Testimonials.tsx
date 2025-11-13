import { Quote } from "lucide-react";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { cn } from "@/lib/utils";

export const Testimonials = () => {
  const { ref, isVisible } = useIntersectionReveal();

  const testimonials = [
    {
      name: "Carlos Eduardo Silva",
      text:
        "Excelente estrutura e instrutores altamente capacitados. Me senti seguro durante todo o treinamento e aprendi técnicas que realmente fazem a diferença.",
      featured: true,
    },
    {
      name: "Ana Paula Mendes",
      text:
        "Curso superou minhas expectativas. A atenção aos detalhes de segurança e a metodologia prática me deram muita confiança.",
      featured: false,
    },
    {
      name: "Roberto Almeida",
      text:
        "Profissionais sérios e comprometidos. Ambiente controlado e seguro. Recomendo para quem quer aprender com responsabilidade.",
      featured: false,
    },
  ];

  return (
    <section
      ref={ref}
      className={cn("py-20 bg-background", isVisible && "reveal-in")}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            CONFIANÇA
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Depoimentos reais de quem confia na G-TACTICAL
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Destaque */}
          <div className="md:col-span-2 glass rounded-2xl p-8 md:p-10">
            <Quote className="h-12 w-12 text-white/40 mb-4" />
            <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed text-white/90">
              “{testimonials[0].text}”
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D9D9D9]/15 flex items-center justify-center font-bold text-[#E5E5E5]">
                {testimonials[0].name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold">{testimonials[0].name}</div>
                <div className="text-sm text-foreground/60">
                </div>
              </div>
            </div>
          </div>

          {/* Secundários */}
          {testimonials.slice(1).map((t, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <Quote className="h-8 w-8 text-white/40 mb-3" />
              <blockquote className="text-base text-white/85 mb-4">
                “{t.text}”
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D9D9D9]/15 flex items-center justify-center font-bold text-[#E5E5E5] text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
