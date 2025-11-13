// src/components/Courses.tsx
import { useEffect, useState } from "react";
import { fetchCourses } from "@/data/courses";
import { Clock } from "lucide-react";

type PublicCourse = {
  id: string;
  title: string;
  description: string;
  level: string;     // "Iniciante" | "Modular" | "Tático" | "Avançado"
  duration?: string; // ex.: "16h"
};

// 🔗 Substitua pelo número oficial da G-TACTICAL no formato DDI + DDD + número
const WHATSAPP_NUMBER = "5541987801458";

const getWhatsAppLink = (course: PublicCourse) => {
  const message = `Olá, gostaria de saber mais sobre o curso ${course.title} da G-TACTICAL.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

const levelColors: Record<string, string> = {
  Iniciante: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  Modular: "bg-sky-500/15 text-sky-300 border-sky-500/40",
  Tático: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  "Tático Avançado": "bg-red-500/15 text-red-300 border-red-500/40",
  Avançado: "bg-red-500/15 text-red-300 border-red-500/40",
};

const Courses = () => {
  const [items, setItems] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchCourses();
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <section id="cursos" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Cabeçalho da seção */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Cursos
          </h2>
          <p className="text-white/70">
            Treinamentos táticos com foco em segurança, técnica e decisão sob pressão.
          </p>
        </div>

        {/* Estados de carregamento / vazio / lista */}
        {loading ? (
          <p className="text-white/60 text-center">Carregando cursos...</p>
        ) : items.length === 0 ? (
          <p className="text-white/60 text-center">
            Nenhum curso disponível no momento.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((c) => (
              <article
                key={c.id}
                className="relative group rounded-2xl overflow-hidden bg-white/[0.02]
                           border border-white/10 p-5 
                           transition-all duration-300
                           hover:-translate-y-2 hover:border-amber-400/60
                           hover:shadow-[0_0_35px_rgba(251,191,36,0.25)]"
              >
                {/* Linha tática no topo */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400/70 via-amber-400/80 to-emerald-400/70 opacity-70" />

                {/* Header: título + nível */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-white text-lg font-semibold leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/40 mt-1">
                      Curso oficial G-TACTICAL
                    </p>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold uppercase tracking-wide ${
                      levelColors[c.level] ?? "bg-zinc-500/20 text-zinc-200 border-zinc-500/40"
                    }`}
                  >
                    {c.level}
                  </span>
                </div>

                {/* Descrição */}
                <p className="text-white/70 text-sm line-clamp-3 mb-4">
                  {c.description}
                </p>

                {/* Rodapé: duração + CTA WhatsApp */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="h-4 w-4" />
                    <span>
                      Duração:{" "}
                      <span className="text-white font-medium">
                        {c.duration || "Consultar"}
                      </span>
                    </span>
                  </div>

                  <a
                    href={getWhatsAppLink(c)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300/90 text-xs font-semibold uppercase tracking-wide flex items-center gap-1
                               translate-x-0 group-hover:translate-x-1 transition-transform"
                  >
                    Ver detalhes
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Export default e nomeado, para funcionar com qualquer tipo de import
export default Courses;
export { Courses };
