// src/admin/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminNav } from "../components/AdminNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type LeadStatus = "novo" | "contatado" | "confirmado" | "cancelado";

type RecentLead = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  created_at: string;
  courses?: { title: string } | null;
};

type ChartPoint = {
  day: string;
  inscricoes: number;
};

type DashboardStats = {
  totalLeads30d: number;
  totalLeadsAll: number;
  activeCourses: number;
};

const weekdayLabel = (date: Date) => {
  const day = date.getDay(); // 0 = dom
  const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return labels[day];
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads30d: 0,
    totalLeadsAll: 0,
    activeCourses: 0,
  });

  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([loadStats(), loadChart(), loadRecentLeads()]);
      setLoading(false);
    };
    load();
  }, []);

  const loadStats = async () => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Leads últimos 30 dias
    const { count: leads30 } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString());

    // Leads total
    const { count: leadsAll } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    // Cursos ativos
    const { count: activeCourses } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    setStats({
      totalLeads30d: leads30 || 0,
      totalLeadsAll: leadsAll || 0,
      activeCourses: activeCourses || 0,
    });
  };

  const loadChart = async () => {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 6); // últimos 7 dias

    const { data, error } = await supabase
      .from("leads")
      .select("id, created_at")
      .gte("created_at", start.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("chart leads error:", error);
      setChartData([]);
      return;
    }

    // Mapa dia -> count
    const buckets = new Map<string, number>();

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      buckets.set(key, 0);
    }

    (data || []).forEach((row) => {
      const key = (row as any).created_at.slice(0, 10);
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) || 0) + 1);
      }
    });

    const points: ChartPoint[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      points.push({
        day: weekdayLabel(d),
        inscricoes: buckets.get(key) || 0,
      });
    }

    setChartData(points);
  };

  const loadRecentLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select(
        `
        id,
        full_name,
        email,
        phone,
        status,
        created_at,
        courses ( title )
      `
      )
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error) setRecentLeads((data || []) as any);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-foreground/70">
            Visão geral das inscrições e cursos.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <AdminNav />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground/60">
                    Leads (últimos 30 dias)
                  </span>
                  <Users className="h-4 w-4 text-foreground/50" />
                </div>
                <div className="text-2xl font-bold">
                  {loading ? "…" : stats.totalLeads30d}
                </div>
                <p className="text-xs text-foreground/60 mt-1">
                  Novas inscrições no período recente
                </p>
              </div>

              <div className="glass rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground/60">
                    Leads totais
                  </span>
                  <TrendingUp className="h-4 w-4 text-foreground/50" />
                </div>
                <div className="text-2xl font-bold">
                  {loading ? "…" : stats.totalLeadsAll}
                </div>
                <p className="text-xs text-foreground/60 mt-1">
                  Inscrições acumuladas
                </p>
              </div>

              <div className="glass rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground/60">
                    Cursos ativos
                  </span>
                  <Target className="h-4 w-4 text-foreground/50" />
                </div>
                <div className="text-2xl font-bold">
                  {loading ? "…" : stats.activeCourses}
                </div>
                <p className="text-xs text-foreground/60 mt-1">
                  Cursos disponíveis na vitrine
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="glass rounded-xl p-6">
              <h2 className="font-display text-xl font-bold mb-4">
                Inscrições por dia (últimos 7 dias)
              </h2>
              {chartData.length === 0 ? (
                <p className="text-sm text-foreground/60">
                  Ainda não há inscrições registradas nos últimos 7 dias.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <ReBarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <XAxis
                      dataKey="day"
                      stroke="rgba(255,255,255,0.5)"
                      tickLine={false}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      allowDecimals={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.9)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "white" }}
                    />
                    <Bar dataKey="inscricoes" fill="hsl(var(--primary))" />
                  </ReBarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Recent Leads Table */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold">
                  Últimas 5 inscrições
                </h2>
                <Link to="/admin/leads">
                  <Button variant="outline">Ver todas</Button>
                </Link>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
                {loading ? (
                  <div className="p-6 text-foreground/60">Carregando…</div>
                ) : recentLeads.length === 0 ? (
                  <div className="p-6 text-foreground/60">
                    Nenhuma inscrição registrada ainda.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-foreground/60 border-b border-white/10">
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3">Curso</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeads.map((l) => (
                        <tr
                          key={l.id}
                          className="border-b border-white/5 hover:bg-white/[0.04] transition-colors"
                        >
                          <td className="px-4 py-3 font-medium">
                            {l.full_name}
                          </td>
                          <td className="px-4 py-3">
                            {l.courses?.title || "-"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge className="border text-xs font-semibold px-2.5 py-1 capitalize">
                              {l.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-foreground/60">
                            {new Date(l.created_at).toLocaleDateString("pt-BR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/admin/leads"
                className="glass rounded-xl p-6 hover:bg-white/[0.04] transition-colors"
              >
                <h3 className="font-semibold mb-2">Inscrições</h3>
                <p className="text-sm text-foreground/70">
                  Gerenciar todas as inscrições recebidas.
                </p>
              </Link>
              <Link
                to="/admin/courses"
                className="glass rounded-xl p-6 hover:bg-white/[0.04] transition-colors"
              >
                <h3 className="font-semibold mb-2">Cursos</h3>
                <p className="text-sm text-foreground/70">
                  Criar, editar e organizar os cursos disponíveis.
                </p>
              </Link>
              <Link
                to="/admin/settings"
                className="glass rounded-xl p-6 hover:bg-white/[0.04] transition-colors"
              >
                <h3 className="font-semibold mb-2">Configurações</h3>
                <p className="text-sm text-foreground/70">
                  Ajustar preferências e integrações do sistema.
                </p>
              </Link>
            </div>

            {/* TODO Auth */}
            <div className="mt-8 glass rounded-xl p-6 border border-primary/20">
              <p className="text-sm text-foreground/70">
                <strong>Próximos passos:</strong> adicionar autenticação
                (Supabase Auth/JWT) para proteger o painel administrativo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
