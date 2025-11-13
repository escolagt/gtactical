// src/components/Courses.tsx
import { useEffect, useState } from "react";
import { fetchCourses } from "@/data/courses";

type PublicCourse = {
  id: string;
  title: string;
  description: string;
  level: string;      // "Iniciante" | "Modular" | "Tático" | "Avançado"
  duration?: string;  // ex.: "16h"
  posterSrc?: string; // URL da imagem
  modelSrc?: string;  // URL do glb (se houver)
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
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition"
              >
                {/* Poster / imagem do curso */}
                <div className="aspect-video rounded-lg bg-white/[0.06] border border-white/10 mb-4 overflow-hidden">
                  {c.posterSrc ? (
                    <img
                      src={c.posterSrc}
                      alt={c.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                {/* Título + nível */}
                <h3 className="text-white text-lg font-semibold mb-1">
                  {c.title}
                </h3>
                <div className="text-xs uppercase tracking-wide text-white/50 mb-2">
                  {c.level}
                </div>

                {/* Descrição */}
                <p className="text-white/70 text-sm line-clamp-3 mb-4">
                  {c.description}
                </p>

                {/* Duração (se houver) */}
                {c.duration && (
                  <div className="text-white/60 text-sm">
                    Duração: <span className="text-white">{c.duration}</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Export default E nomeado, para funcionar com qualquer tipo de import
export default Courses;
export { Courses };
