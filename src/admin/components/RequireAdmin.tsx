// src/admin/components/RequireAdmin.tsx
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type RequireAdminProps = {
  children: ReactNode;
};

export default function RequireAdmin({ children }: RequireAdminProps) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setChecking(true);

      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (cancelled) return;

      if (error) {
        console.error("Erro ao buscar sessão:", error);
        setAllowed(false);
        setChecking(false);
        return;
      }

      if (!session) {
        setAllowed(false);
        setChecking(false);
        return;
      }

      // 👉 Por enquanto: qualquer usuário logado pode acessar a área admin
      setAllowed(true);
      setChecking(false);

      // 🔒 FUTURO (opcional): restringir por email
      // const adminEmails = ["seu-email@exemplo.com", "outro-admin@exemplo.com"];
      // setAllowed(adminEmails.includes(session.user.email ?? ""));
      // setChecking(false);
    };

    run();
    // reexecuta quando navega (depois do login, por exemplo)
    return () => {
      cancelled = true;
    };
  }, [location.key]);

  // Loading bonitinho enquanto checa
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/70">Verificando acesso...</p>
      </div>
    );
  }

  // Se NÃO tiver acesso → manda para login
  if (!allowed) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // Se pode acessar → renderiza o conteúdo protegido
  return <>{children}</>;
}
