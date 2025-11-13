import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminNav } from "../components/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

type CourseRef = { id: string; title: string; slug: string };
type ScheduleRow = {
  id: string;
  course_id: string;
  start_date: string | null;
  end_date: string | null;
  time_start: string | null;
  time_end: string | null;
  location: string;
  max_students: number;
  enrolled_count: number;
  status: "aberto" | "em_andamento" | "concluido" | "cancelado";
  notes: string | null;
  created_at: string;
};

const emptyForm = {
  course_id: "",
  start_date: "",
  end_date: "",
  time_start: "",
  time_end: "",
  location: "",
  max_students: 12,
  status: "aberto" as ScheduleRow["status"],
  notes: "",
};

export default function Schedules() {
  const [items, setItems] = useState<(ScheduleRow & { courses?: CourseRef | null })[]>([]);
  const [courses, setCourses] = useState<CourseRef[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduleRow | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [cRes, sRes] = await Promise.all([
      supabase
        .from("courses")
        .select("id, title, slug")
        .eq("is_active", true)
        .order("title"),
      supabase
        .from("schedules")
        .select(`*, courses(id, title, slug)`)
        .order("start_date")
    ]);
    if (!cRes.error) setCourses((cRes.data || []) as CourseRef[]);
    if (!sRes.error) setItems((sRes.data || []) as any);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(i =>
      (i.courses?.title || "").toLowerCase().includes(q) ||
      (i.location || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const submit = async () => {
    setSaving(true);
    const payload = {
      course_id: form.course_id || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      time_start: form.time_start || null,
      time_end: form.time_end || null,
      location: form.location || "",
      max_students: Number(form.max_students || 12),
      status: form.status,
      notes: form.notes || null,
    };

    const isEdit = !!editing;
    const { error } = isEdit
      ? await supabase.from("schedules").update(payload).eq("id", editing!.id)
      : await supabase.from("schedules").insert(payload);

    setSaving(false);
    if (error) {
      console.error(error);
      return;
    }
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Remover esta turma?")) return;
    const { error } = await supabase.from("schedules").delete().eq("id", id);
    if (!error) load();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-sm text-foreground/60 mb-4">
          Dashboard / <span className="text-foreground">Turmas</span>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Turmas</h1>
            <p className="text-foreground/70">Gerencie as datas e locais de cada curso.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] text-white"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
                setOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Turma
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AdminNav />
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
              <Search className="h-5 w-5 text-foreground/50" />
              <Input
                placeholder="Buscar por curso ou local…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/[0.05] border-white/10"
              />
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
              {loading ? (
                <div className="p-6 text-foreground/60">Carregando…</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-foreground/60 border-b border-white/10">
                      <th className="px-4 py-3">Curso</th>
                      <th className="px-4 py-3">Início</th>
                      <th className="px-4 py-3">Fim</th>
                      <th className="px-4 py-3">Local</th>
                      <th className="px-4 py-3">Vagas</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-white/5 hover:bg-white/[0.04]"
                      >
                        <td className="px-4 py-3 font-medium">
                          {s.courses?.title || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {s.start_date
                            ? new Date(s.start_date).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          {s.end_date
                            ? new Date(s.end_date).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>
                        <td className="px-4 py-3">{s.location}</td>
                        <td className="px-4 py-3">
                          {s.enrolled_count}/{s.max_students}
                        </td>
                        <td className="px-4 py-3 capitalize">
                          {s.status.replace("_", " ")}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/70 hover:text-white hover:bg-white/10 mr-2"
                            onClick={() => {
                              setEditing(s as any);
                              setForm({
                                course_id: s.course_id,
                                start_date: s.start_date ?? "",
                                end_date: s.end_date ?? "",
                                time_start: s.time_start ?? "",
                                time_end: s.time_end ?? "",
                                location: s.location,
                                max_students: s.max_students,
                                status: s.status,
                                notes: s.notes ?? "",
                              });
                              setOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                            onClick={() => remove(s.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          className="px-4 py-6 text-foreground/60"
                          colSpan={7}
                        >
                          Nenhuma turma encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl bg-white/[0.02] border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editing ? "Editar turma" : "Nova turma"}
              </DialogTitle>
              <DialogDescription className="text-foreground/70">
                Defina curso, datas e capacidade.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Curso *</Label>
                <select
                  className="w-full rounded-md bg-black/70 text-white border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                  value={form.course_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, course_id: e.target.value }))
                  }
                >
                  <option value="" className="bg-black text-white">
                    Selecione
                  </option>
                  {courses.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className="bg-black text-white"
                    >
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Início *</Label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, start_date: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label>Fim</Label>
                <Input
                  type="date"
                  value={form.end_date || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, end_date: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label>Hora início</Label>
                <Input
                  type="time"
                  value={form.time_start || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, time_start: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label>Hora fim</Label>
                <Input
                  type="time"
                  value={form.time_end || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, time_end: e.target.value }))
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Local *</Label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label>Vagas *</Label>
                <Input
                  type="number"
                  value={form.max_students}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      max_students: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label>Status</Label>
                <select
                  className="w-full rounded-md bg-white/[0.05] text-white border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as any }))
                  }
                >
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Label>Observações</Label>
                <textarea
                  className="w-full rounded-md bg-white/[0.05] border border-white/10 px-3 py-2"
                  rows={3}
                  value={form.notes || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>
            </div>

            <Separator className="my-3 bg-white/10" />
            <DialogFooter>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Fechar
              </Button>
              <Button
                disabled={saving}
                className="bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] text-white"
                onClick={submit}
              >
                {saving
                  ? "Salvando…"
                  : editing
                  ? "Salvar alterações"
                  : "Criar turma"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
