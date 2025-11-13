import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, BookOpen, Award } from "lucide-react";

interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => void;
}

export const CourseCard = ({ course, onEnroll }: CourseCardProps) => {
  const levelColors: Record<string, string> = {
    Iniciante: "bg-green-500/20 text-green-400 border-green-500/30",
    Modular: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Tático: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Avançado: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const silverIcon = "text-[#E5E5E5]"; // prata neutro

  return (
    <div className="relative rounded-2xl overflow-hidden group">
      {/* Barra tática animada no topo */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400/70 via-amber-400/80 to-emerald-400/70 animate-pulse" />

      <div className="glass bg-white/[0.02] border border-white/10 rounded-2xl p-6 pt-5 transition-all duration-300
                      hover:-translate-y-2 hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(251,191,36,0.35)]">
        {/* Header: título + nível */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-display text-2xl font-bold leading-snug">
              {course.title}
            </h3>
            <p className="text-sm text-foreground/60 mt-1">
              Curso oficial G-TACTICAL · Segurança e preparo estratégico
            </p>
          </div>

          <Badge
            className={`shrink-0 ${levelColors[course.level] ?? "bg-zinc-500/20 text-zinc-200 border-zinc-500/40"} border font-semibold`}
          >
            {course.level}
          </Badge>
        </div>

        {/* Descrição */}
        <p className="text-foreground/70 mb-4 text-sm leading-relaxed line-clamp-3">
          {course.description}
        </p>

        {/* Detalhes principais */}
        <div className="space-y-2.5 mb-5 text-sm">
          {course.objectives?.[0] && (
            <div className="flex items-start gap-2">
              <Target className={`h-4 w-4 ${silverIcon} mt-0.5 flex-shrink-0`} />
              <div>
                <span className="font-semibold">Objetivo principal:</span>{" "}
                <span className="text-foreground/70">
                  {course.objectives[0]}
                </span>
              </div>
            </div>
          )}

          {course.methodology && (
            <div className="flex items-start gap-2">
              <BookOpen
                className={`h-4 w-4 ${silverIcon} mt-0.5 flex-shrink-0`}
              />
              <div>
                <span className="font-semibold">Metodologia:</span>{" "}
                <span className="text-foreground/70">
                  {course.methodology}
                </span>
              </div>
            </div>
          )}

          {course.outcome && (
            <div className="flex items-start gap-2">
              <Award className={`h-4 w-4 ${silverIcon} mt-0.5 flex-shrink-0`} />
              <div>
                <span className="font-semibold">Resultados esperados:</span>{" "}
                <span className="text-foreground/70">
                  {course.outcome}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-foreground/60 text-sm">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{course.duration}</span>
          </div>

          <Button
            onClick={() => onEnroll(course.id)}
            className="bg-white/[0.08] text-white border border-white/20 hover:bg-amber-400/20 hover:border-amber-300 font-semibold transition-all"
          >
            Inscrever-se →
          </Button>
        </div>
      </div>
    </div>
  );
};
