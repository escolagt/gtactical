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
    <div className="glass rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-all hover:-translate-y-2 group">
      {/* Poster */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img
          src={course.posterSrc}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "/posters/course_placeholder.webp";
          }}
        />

        <Badge
          className={`absolute top-4 right-4 ${levelColors[course.level]} border font-semibold`}
        >
          {course.level}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-2xl font-bold mb-3">{course.title}</h3>

        <p className="text-foreground/70 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Details */}
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex items-start gap-2">
            <Target className={`h-4 w-4 ${silverIcon} mt-0.5 flex-shrink-0`} />
            <div>
              <span className="font-semibold">Objetivo:</span>{" "}
              <span className="text-foreground/70">
                {course.objectives[0]}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <BookOpen className={`h-4 w-4 ${silverIcon} mt-0.5 flex-shrink-0`} />
            <div>
              <span className="font-semibold">Metodologia:</span>{" "}
              <span className="text-foreground/70">{course.methodology}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Award className={`h-4 w-4 ${silverIcon} mt-0.5 flex-shrink-0`} />
            <div>
              <span className="font-semibold">Resultado:</span>{" "}
              <span className="text-foreground/70">{course.outcome}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-foreground/60">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{course.duration}</span>
          </div>

          {/* Botão neutro (quase preto/vidro) + borda prata sutil */}
          <Button
            onClick={() => onEnroll(course.id)}
            className="bg-white/[0.08] text-white border border-white/20 hover:bg-white/[0.12] font-semibold"
          >
            Inscrever-se →
          </Button>
        </div>
      </div>
    </div>
  );
};
