// src/data/courses.ts
import { supabase } from "@/integrations/supabase/client";
import type { CourseRow } from "@/integrations/supabase/types";

/**
 * Mapeia o enum do banco para label bonitinho na UI pública
 */
function mapLevel(level: string): "Iniciante" | "Modular" | "Tático" | "Avançado" {
  const mapping: Record<string, "Iniciante" | "Modular" | "Tático" | "Avançado"> = {
    iniciante: "Iniciante",
    modular: "Modular",
    tatico: "Tático",
    avancado: "Avançado",
  };
  return mapping[level] ?? "Iniciante";
}

/**
 * Cursos para o SITE PÚBLICO (seção de cursos na landing)
 */
export async function fetchCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_active", true)
    .order("title");

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }

  return (data || []).map((course: any) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    level: mapLevel(course.level),
    duration: course.duration_hours ? `${course.duration_hours}h` : undefined,
    posterSrc: course.poster_url || "/posters/course_placeholder.webp",
    modelSrc: course.model_url || undefined,
  }));
}

/**
 * Cursos ativos em formato "cru", direto da tabela
 * Útil para painel admin, selects, etc.
 */
export async function fetchCoursesActive(): Promise<CourseRow[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_active", true)
    .order("title");

  if (error) {
    console.error(error);
    return [];
  }
  return (data || []) as CourseRow[];
}

/**
 * CRUD para o painel administrativo
 */
export async function listCourses(): Promise<CourseRow[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as CourseRow[];
}

export async function createCourse(payload: Partial<CourseRow>) {
  const { data, error } = await supabase
    .from("courses")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as CourseRow;
}

export async function updateCourse(id: string, changes: Partial<CourseRow>) {
  const { data, error } = await supabase
    .from("courses")
    .update(changes)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CourseRow;
}

export async function deleteCourse(id: string) {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- TURMAS / SCHEDULES -------------------- */

export type ScheduleOption = {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  location: string;
  availableSlots: number;
  totalSlots: number;
};

/**
 * Busca turmas abertas e futuras
 */
export async function fetchSchedulesOpen(): Promise<ScheduleOption[]> {
  const { data, error } = await supabase
    .from("schedules")
    .select(`
      id,
      start_date,
      location,
      max_students,
      enrolled_count,
      courses (
        id,
        title
      )
    `)
    .eq("status", "aberto")
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }

  return (data || []).map((row: any) => {
    const total = typeof row.max_students === "number" ? row.max_students : 0;
    const enrolled =
      typeof row.enrolled_count === "number" ? row.enrolled_count : 0;

    return {
      id: row.id,
      courseId: row.courses?.id ?? "",
      courseName: row.courses?.title ?? "Curso",
      date: row.start_date,
      location: row.location ?? "",
      availableSlots: Math.max(0, total - enrolled),
      totalSlots: total,
    } as ScheduleOption;
  });
}
