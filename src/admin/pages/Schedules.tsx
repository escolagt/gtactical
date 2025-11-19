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
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  is_active: boolean;
};

const emptyForm: { title: string; slug: string; is_active: boolean } = {
  title: "",
  slug: "",
  is_active: true,
};

export default function CoursesAdmin() {
  const [items, setItems] = useState<CourseRow[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CourseRow | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("id, title, slug, is_active")
      .order("title");

    if (!error && data) {
      setItems(data as CourseRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((i) =>
      (i.title || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const handleSlugAuto = (title: string) => {
    const base = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm((f) => ({ ...f, title, slug: f.slug ? f.slug : base }));
  };

  const submit = async () => {
    if (!form.title.trim()) {
      alert("Informe o título do curso.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || form.title.trim().toLowerCase().replace(/\s+/g, "-"),
      is_active: form.is_active,
    };

    setSaving(true);
    const isEdit = !!editing;

    const { error } = isEdit
      ? await supabase
          .from("courses")
          .update(payload)
          .eq("id", editing!.id)
      : await supabase.from("courses").insert(payload);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Erro ao salvar curso. Veja o console para detalhes.");
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
    if (!error) load();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-sm text-foreground/60 mb-4">
          Dashboard / <span className="text-foreground">Cursos</span>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Cursos
            </h1>
            <p className="text-foreground/70">
              Cadastre e gerencie os cursos da escola de tiro.
            </p>
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
              Novo curso
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
                placeholder="Buscar por curso…"
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
                      <th className="px-4 py-3">Título</th>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-white/5 hover:bg-white/[0.04]"
                      >
                        <td className="px-4 py-3 font-medium">{c.title}</td>
                        <td className="px-4 py-3 text-foreground/70">
                          {c.slug}
                        </td>
                        <td className="px-4 py-3">
                          {c.is_active ? "Ativo" : "Inativo"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/70 hover:text-white hover:bg-white/10 mr-2"
                            onClick={() => {
                              setEditing(c);
                              setForm({
                                title: c.title,
                                slug: c.slug,
                                is_active: c.is_active,
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
                            onClick={() => remove(c.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && !loading && (
                      <tr>
                        <td
                          className="px-4 py-6 text-foreground/60"
                          colSpan={4}
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
          <DialogContent className="sm:max-w-lg bg-white/[0.02] border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editing ? "Editar curso" : "Novo curso"}
              </DialogTitle>
              <DialogDescription className="text-foreground/70">
                Defina as informações básicas do curso. Depois você pode
                complementar em outras telas, se necessário.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Título *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => handleSlugAuto(e.target.value)}
                />
              </div>

              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  placeholder="ex: defesa-residencial"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_active: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border border-white/40 bg-transparent"
                />
                <Label htmlFor="is_active" className="text-sm">
                  Curso ativo (aparece na vitrine)
                </Label>
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
                  : "Criar curso"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
