import { supabase } from "@/integrations/supabase/client";
import type { ScheduleRow } from "@/integrations/supabase/types";

export async function fetchOpenSchedules() {
  const { data, error } = await supabase
    .from("schedules")
    .select(`*, courses ( title, slug )`)
    .eq("status", "aberto")
    .order("start_date");
  if (error) { console.error(error); return []; }
  return data;
}

// CRUD painel
export async function listSchedules(courseId?: string): Promise<ScheduleRow[]> {
  let q = supabase.from("schedules").select("*").order("start_date");
  if (courseId) q = q.eq("course_id", courseId);
  const { data, error } = await q;
  if (error) throw error;
  return data as ScheduleRow[];
}

export async function createSchedule(payload: Partial<ScheduleRow>) {
  const { data, error } = await supabase.from("schedules").insert(payload).select().single();
  if (error) throw error;
  return data as ScheduleRow;
}

export async function updateSchedule(id: string, changes: Partial<ScheduleRow>) {
  const { data, error } = await supabase.from("schedules").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return data as ScheduleRow;
}

export async function deleteSchedule(id: string) {
  const { error } = await supabase.from("schedules").delete().eq("id", id);
  if (error) throw error;
}
