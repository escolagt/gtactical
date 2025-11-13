import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "moderator" | "user";
type SessionUser = { id: string; email?: string | null };

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async (uid: string) => {
    // Busca a role efetiva (se vários papéis, prioriza admin > moderator > user)
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid);
    if (error) {
      console.error("roles error", error);
      setRole(null);
      return;
    }
    const roles = (data || []).map(r => r.role) as AppRole[];
    if (roles.includes("admin")) setRole("admin");
    else if (roles.includes("moderator")) setRole("moderator");
    else if (roles.includes("user")) setRole("user");
    else setRole(null);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user ? { id: session.user.id, email: session.user.email } : null;
      setUser(u);
      if (u) await fetchRole(u.id);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      const u = session?.user ? { id: session.user.id, email: session.user.email } : null;
      setUser(u);
      if (u) await fetchRole(u.id);
      else setRole(null);
    });
    return () => sub.subscription.unsubscribe();
  }, [fetchRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, role, loading, signOut, isAdmin: role === "admin" || role === "moderator" };
}
