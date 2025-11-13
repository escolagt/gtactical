import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminNav } from "../components/AdminNav";
import { Search, Filter, Download, Eye, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type LeadStatus = "novo" | "contatado" | "confirmado" | "cancelado";

type LeadRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  created_at: string;
  // joins:
  courses?: { title: string } | null;
  schedules?: { start_date: string | null; location: string | null } | null;
};

const Leads = () => {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const close = () => setSelected(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select(`
        id, full_name, email, phone, status, created_at,
        courses ( title ),
        schedules ( start_date, location )
      `)
      .order("created_at", { ascending: false });
    if (!error) setLeads((data || []) as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((l) =>
      (l.full_name || "").toLowerCase().includes(q) ||
      (l.courses?.title || "").toLowerCase().includes(q)
    );
  }, [leads, search]);

  const exportCsv = () => {
    const rows = [
      ["Nome", "Curso", "Turma", "Status", "Data", "Email", "Telefone"],
      ...filtered.map(l => [
        l.full_name,
        l.courses?.title || "",
        l.schedules?.start_date ? new Date(l.schedules.start_date).toLocaleDateString("pt-BR") : "",
        l.status,
        new Date(l.created_at).toLocaleDateString("pt-BR"),
        l.email,
        l.phone
      ])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const setStatus = async (id: string, status: LeadStatus) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (!error) load();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-sm text-foreground/60 mb-4">
          Dashboard / <span className="text-foreground">Inscrições</span>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Inscrições
            </h1>
            <p className="text-foreground/70">
              Gerencie as inscrições recebidas dos formulários.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button onClick={exportCsv} className="bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] text-white">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
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
                type="text"
                placeholder="Buscar por nome ou curso..."
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
                      <th className="px-4 py-3">Nome</th>
                      <th className="px-4 py-3">Curso</th>
                      <th className="px-4 py-3">Turma</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((l) => (
                      <tr key={l.id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                        <td className="px-4 py-3 font-medium">{l.full_name}</td>
                        <td className="px-4 py-3">{l.courses?.title || "-"}</td>
                        <td className="px-4 py-3 text-foreground/70">
                          {l.schedules?.start_date ? new Date(l.schedules.start_date).toLocaleDateString("pt-BR") : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={cn(
                              "border text-xs font-semibold px-2.5 py-1 capitalize",
                              l.status === "confirmado" &&
                                "bg-green-500/10 text-green-400 border-green-500/30",
                              l.status === "novo" &&
                                "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                              l.status === "contatado" &&
                                "bg-blue-500/10 text-blue-400 border-blue-500/30",
                              l.status === "cancelado" &&
                                "bg-red-500/10 text-red-400 border-red-500/30"
                            )}
                          >
                            {l.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-foreground/60">
                          {new Date(l.created_at).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => setSelected(l)}
                            aria-label={`Ver detalhes de ${l.full_name}`}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 && !loading && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-foreground/50">
                          Nenhuma inscrição encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              <Dialog open={!!selected} onOpenChange={(o) => !o && close()}>
                <DialogContent className="sm:max-w-lg bg-white/[0.02] border border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white">Detalhes da inscrição</DialogTitle>
                    <DialogDescription className="text-foreground/70">
                      Visualize e gerencie as informações do lead.
                    </DialogDescription>
                  </DialogHeader>

                  {selected && (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold">{selected.full_name}</div>
                          <div className="text-sm text-foreground/60">
                            {new Date(selected.created_at).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            "border text-xs font-semibold px-2.5 py-1 capitalize",
                            selected.status === "confirmado" &&
                              "bg-green-500/10 text-green-400 border-green-500/30",
                            selected.status === "novo" &&
                              "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                            selected.status === "contatado" &&
                              "bg-blue-500/10 text-blue-400 border-blue-500/30",
                            selected.status === "cancelado" &&
                              "bg-red-500/10 text-red-400 border-red-500/30"
                          )}
                        >
                          {selected.status}
                        </Badge>
                      </div>

                      <Separator className="bg-white/10" />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-foreground/60">Curso</div>
                          <div className="font-medium">{selected.courses?.title || "-"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-foreground/60">Turma</div>
                          <div className="font-medium">
                            {selected.schedules?.start_date
                              ? new Date(selected.schedules.start_date).toLocaleDateString("pt-BR")
                              : "-"}
                            {selected.schedules?.location ? ` · ${selected.schedules.location}` : ""}
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-white/60" />
                          <a href={`mailto:${selected.email}`} className="text-white hover:underline">
                            {selected.email}
                          </a>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-white/60" />
                          <a href={`tel:${selected.phone}`} className="text-white hover:underline">
                            {selected.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <DialogFooter className="mt-6 flex gap-2 sm:gap-2">
                    {selected && (
                      <Button
                        className="bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] text-white"
                        onClick={() => {
                          const phone = selected.phone.replace(/\D/g, "");
                          const msg = encodeURIComponent(
                            `Olá ${selected.full_name}, aqui é da G-TACTICAL sobre sua inscrição no curso ${selected.courses?.title || ""} (${selected.schedules?.start_date ? new Date(selected.schedules.start_date).toLocaleDateString("pt-BR") : ""}).`
                          );
                          window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    )}

                    {selected && (
                      <>
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => { setStatus(selected.id, "cancelado"); close(); }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          className="bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] text-white"
                          onClick={() => { setStatus(selected.id, "confirmado"); close(); }}
                        >
                          Confirmar
                        </Button>
                      </>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;
