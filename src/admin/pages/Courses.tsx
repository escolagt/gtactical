import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminNav } from "../components/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

type CourseLevel = "iniciante" | "modular" | "tatico" | "avancado";

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  level: CourseLevel;
  description: string;
  objectives: string[];
  methodology: string | null;
  expected_results: string | null;
  duration_hours: number;
  max_students: number;
  price: number | null;
  model_url: string | null;   // pode manter na tabela, só não editamos mais aqui
  poster_url: string | null;  // idem
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type CourseForm = {
  slug: string;
  title: string;
  level: CourseLevel;
  description: string;
  objectives: string;
  methodology: string;
  expected_results: string;
  duration_hours: string;
  max_students: string;
  price: string;
  is_active: boolean;
};

const emptyForm: CourseForm = {
  slug: "",
  title: "",
  level: "iniciante",
  description: "",
  objectives: "",
  methodology: "",
  expected_results: "",
  duration_hours: "8",
  max_students: "12",
  price: "",
  is_active: true,
};

function normalizeSlug(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function Courses() {
  const [items, setItems] = useState<CourseRow[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CourseRow | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const load = async () => {
    setLoading(true);
    setErrorMsg("");
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      setErrorMsg("Falha ao carregar cursos.");
    } else {
      setItems((data || []) as CourseRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.slug.toLowerCase().includes(q) ||
        i.level.toLowerCase().includes(q)
    );
  }, [items, search]);

  function validate(): string | null {
    if (!form.title.trim()) return "Título é obrigatório.";
    if (!form.slug.trim()) return "Slug é obrigatório.";
    if (!form.description.trim()) return "Descrição é obrigatória.";
    const dur = Number(form.duration_hours);
    if (Number.isNaN(dur) || dur <= 0) return "Duração deve ser > 0.";
    const max = Number(form.max_students);
    if (Number.isNaN(max) || max <= 0) return "Vagas devem ser > 0.";
    return null;
  }

  const submit = async () => {
    setSaving(true);
    setErrorMsg("");

    const v = validate();
    if (v) {
      setSaving(false);
      setErrorMsg(v);
      return;
    }

    const normalizedSlug = normalizeSlug(form.slug);
    const objectivesArray = String(form.objectives || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const duration = Number(form.duration_hours);
    const max = Number(form.max_students);

    let price: number | null = null;
    if (form.price !== "") {
      const p = Number(form.price.replace(",", "."));
      price = Number.isNaN(p) ? null : p;
    }

    const payload = {
      slug: normalizedSlug,
      title: form.title.trim(),
      level: form.level,
      description: form.description.trim(),
      objectives: objectivesArray,
      methodology: form.methodology ? form.methodology.trim() : null,
      expected_results: form.expected_results ? form.expected_results.trim() : null,
      duration_hours: duration,
      max_students: max,
      price,
      is_active: !!form.is_active,
    };

    const isEdit = !!editing;
    const { error } = isEdit
      ? await supabase.from("courses").update(payload).eq("id", editing!.id)
      : await supabase.from("courses").insert(payload);

    setSaving(false);

    if (error) {
      console.error(error);
      if (
        (error as any).code === "23505" ||
        String(error.message).toLowerCase().includes("duplicate")
      ) {
        setErrorMsg("Slug já está em uso. Escolha outro.");
      } else {
        setErrorMsg("Falha ao salvar o curso.");
      }
      return;
    }

    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este curso?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert("Falha ao remover curso.");
    } else {
      load();
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrorMsg("");
    setOpen(true);
  };

  const openEdit = (c: CourseRow) => {
    setEditing(c);
    setErrorMsg("");
    setForm({
      slug: c.slug,
      title: c.title,
      level: c.level,
      description: c.description ?? "",
      objectives: (c.objectives || []).join("\n"),
      methodology: c.methodology ?? "",
      expected_results: c.expected_results ?? "",
      duration_hours: String(c.duration_hours ?? 0),
      max_students: String(c.max_students ?? 0),
      price: c.price == null ? "" : String(c.price),
      is_active: !!c.is_active,
    });
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-background py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="text-xs sm:text-sm text-foreground/60 mb-3 sm:mb-4">
          Dashboard / <span className="text-foreground">Cursos</span>
        </div>

        <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
              Cursos
            </h1>
            <p className="text-xs sm:text-sm text-foreground/70">
              Gerencie os cursos disponíveis.
            </p>
          </div>
          <div className="flex justify-start md:justify-end">
            <Button
              className="w-full sm:w-auto bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] text-white"
              onClick={openCreate}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <AdminNav />
          </div>

          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/50" />
                <Input
                  placeholder="Buscar por título, slug ou nível…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white/[0.05] border-white/10 text-sm"
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-x-auto">
              {loading ? (
                <div className="p-4 sm:p-6 text-sm text-foreground/60">
                  Carregando…
                </div>
              ) : (
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="text-left text-foreground/60 border-b border-white/10">
                      <th className="px-3 sm:px-4 py-2 sm:py-3">Título</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3">Slug</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3">Nível</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3">Ativo</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-white/5 hover:bg-white/[0.04]"
                      >
                        <td className="px-3 sm:px-4 py-2 sm:py-3 font-medium">
                          {c.title}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 break-all">
                          {c.slug}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 capitalize">
                          {c.level}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <Badge
                            className={
                              c.is_active
                                ? "bg-green-500/10 text-green-400 border-green-500/30"
                                : "bg-red-500/10 text-red-400 border-red-500/30"
                            }
                            variant="outline"
                          >
                            {c.is_active ? "ativo" : "inativo"}
                          </Badge>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 mr-1 sm:mr-2"
                            onClick={() => openEdit(c)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                            onClick={() => remove(c.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          className="px-3 sm:px-4 py-4 sm:py-6 text-foreground/60"
                          colSpan={5}
                        >
                          Nenhum curso encontrado.
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
          <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl bg-white/[0.02] border border-white/10 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-lg sm:text-xl">
                {editing ? "Editar curso" : "Novo curso"}
              </DialogTitle>
              <DialogDescription className="text-sm text-foreground/70">
                Preencha as informações do curso.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-sm">Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      slug: normalizeSlug(e.target.value),
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Título *</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Nível</Label>
                <select
                  className="mt-1 w-full rounded-md bg-black/60 text-white border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                  value={form.level}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      level: e.target.value as CourseLevel,
                    }))
                  }
                >
                  <option value="iniciante">Iniciante</option>
                  <option value="modular">Modular</option>
                  <option value="tatico">Tático</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>
              <div>
                <Label className="text-sm">Duração (horas)</Label>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.duration_hours}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      duration_hours: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Vagas</Label>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.max_students}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      max_students: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Preço (opcional)</Label>
                <Input
                  type="text"
                  placeholder="ex.: 497.00"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm">Descrição *</Label>
                <textarea
                  className="mt-1 w-full rounded-md bg-white/[0.05] border border-white/10 px-3 py-2 text-sm"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm">Objetivos (um por linha)</Label>
                <textarea
                  className="mt-1 w-full rounded-md bg-white/[0.05] border border-white/10 px-3 py-2 text-sm"
                  rows={3}
                  value={form.objectives}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      objectives: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm">Metodologia (opcional)</Label>
                <textarea
                  className="mt-1 w-full rounded-md bg-white/[0.05] border border-white/10 px-3 py-2 text-sm"
                  rows={3}
                  value={form.methodology}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      methodology: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm">
                  Resultados esperados (opcional)
                </Label>
                <textarea
                  className="mt-1 w-full rounded-md bg-white/[0.05] border border-white/10 px-3 py-2 text-sm"
                  rows={3}
                  value={form.expected_results}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      expected_results: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_active: e.target.checked }))
                  }
                  className="mt-0.5"
                />
                <Label htmlFor="is_active" className="text-sm">
                  Ativo
                </Label>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs sm:text-sm text-red-300">
                {errorMsg}
              </div>
            )}

            <Separator className="my-3 bg-white/10" />
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Fechar
              </Button>
              <Button
                disabled={saving}
                className="w-full sm:w-auto bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] text-white"
                onClick={submit}
              >
                {saving ? "Salvando..." : editing ? "Salvar alterações" : "Criar curso"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
