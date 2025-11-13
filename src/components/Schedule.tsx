// src/components/Schedule.tsx
import { useEffect, useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          // aqui você ainda pode integrar com o LeadForm via estado global no futuro
          select.value = courseId;
        }
      }, 500);
    }
  };

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = total > 0 ? (available / total) * 100 : 0;
    if (percentage <= 20)
      return {
        label: "Últimas vagas",
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        pulse: true,
      };
    if (percentage <= 50)
      return {
        label: "Vagas limitadas",
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        pulse: false,
      };
    return {
      label: "Vagas disponíveis",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      pulse: false,
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
            Garanta sua vaga nas próximas turmas disponíveis
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
            {schedules.map((schedule) => {
              const status = getAvailabilityStatus(
                schedule.availableSlots,
                schedule.totalSlots
              );

              return (
                <div
                  key={schedule.id}
                  className="glass rounded-xl p-6 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display text-xl font-bold text-white">
                      {schedule.courseName}
                    </h3>
                    <Badge
                      className={`${status.color} border font-semibold ${
                        status.pulse ? "animate-pulse-slow" : ""
                      }`}
                    >
                      {status.label}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Calendar className="h-4 w-4 text-[#E5E5E5]" />
                      <span className="text-sm">
                        {formatDate(schedule.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-foreground/70">
                      <MapPin className="h-4 w-4 text-[#E5E5E5]" />
                      <span className="text-sm">{schedule.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-foreground/70">
                      <Users className="h-4 w-4 text-[#E5E5E5]" />
                      <span className="text-sm">
                        {schedule.availableSlots} de {schedule.totalSlots} vagas
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleEnroll(schedule.courseId)}
                    className="w-full bg-white/[0.08] text-white border border-white/20 hover:bg-white/[0.12] font-semibold"
                  >
                    Reservar vaga
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
