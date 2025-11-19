// src/components/Schedule.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  fetchSchedulesOpen,
  type ScheduleOption,
} from "@/data/courses";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { cn } from "@/lib/utils";
import { trackCTAClick } from "@/lib/analytics";

export const Schedule = () => {
  const { ref, isVisible } = useIntersectionReveal();
  const [schedules, setSchedules] = useState<ScheduleOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchSchedulesOpen();
      setSchedules(data || []);
      setLoading(false);
    })();
  }, []);

  const handleEnroll = (courseId: string) => {
    trackCTAClick("Schedule", `#inscricao?curso=${courseId}`);
    const form = document.getElementById("inscricao");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const select = document.getElementById("curso") as HTMLSelectElement | null;
        if (select && courseId) {
          select.value = courseId;
        }
      }, 500);
    }
  };

  return (
    <section
      ref={ref}
      className={cn("py-20 bg-background", isVisible && "reveal-in")}
    >
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-texture-cimento">
            TURMAS ABERTAS
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Selecione o curso para iniciar sua inscrição.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-foreground/60">
            Carregando turmas...
          </p>
        ) : schedules.length === 0 ? (
          <p className="text-center text-foreground/60">
            Nenhuma turma aberta no momento.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {schedules.map((schedule) => (
              <button
                key={schedule.id}
                onClick={() => handleEnroll(schedule.courseId)}
                className="glass rounded-xl p-6 text-left hover:bg-white/[0.06] transition-colors border border-white/10 group"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg md:text-xl font-bold text-white">
                    {schedule.courseName}
                  </h3>
                  <span className="text-xs uppercase tracking-wide text-foreground/60 group-hover:text-foreground/80">
                    Selecionar
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
