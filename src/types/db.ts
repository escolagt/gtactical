export type CourseLevel = "iniciante" | "modular" | "tatico" | "avancado";
export type LeadStatus = "novo" | "contatado" | "confirmado" | "cancelado";

export type Course = {
  id: string; slug: string; title: string; level: CourseLevel;
  description: string; objectives: any[]; methodology?: string|null; expected_results?: string|null;
  duration_hours: number; max_students: number; price?: string|null;
  model_url?: string|null; poster_url?: string|null; is_active: boolean;
  created_at: string; updated_at: string;
};

export type Schedule = {
  id: string; course_id: string; start_date: string; end_date?: string|null;
  time_start?: string|null; time_end?: string|null; location: string;
  max_students: number; enrolled_count: number;
  status: "aberto"|"em_andamento"|"concluido"|"cancelado";
  notes?: string|null; created_at: string; updated_at: string;
};

export type Lead = {
  id: string; course_id?: string|null; schedule_id?: string|null;
  full_name: string; birth_date: string; cpf: string; phone: string; email: string;
  city: string; state: string; observations?: string|null; terms_accepted: boolean;
  recording_authorized?: boolean|null; status: LeadStatus; source?: string|null;
  user_agent?: string|null; ip_address?: string|null; created_at: string; updated_at: string;
};
