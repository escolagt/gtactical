import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const loc = useLocation();
  const item = (to: string, label: string) => (
    <Link to={to} className={`px-3 py-2 rounded ${loc.pathname.startsWith(to) ? "bg-white/15" : "hover:bg-white/10"}`}>{label}</Link>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 backdrop-blur bg-black/50 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold">G-TACTICAL • Admin</span>
            <nav className="flex items-center gap-2 text-sm">
              {item("/admin", "Dashboard")}
              {item("/admin/leads", "Leads")}
              {item("/admin/courses", "Cursos")}
              {item("/admin/schedules", "Turmas")}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="opacity-70">{user?.email}</span>
            <Button variant="outline" className="border-white/30" onClick={signOut}>Sair</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
