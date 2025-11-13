import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) setMsg(error.message);
    else window.location.href = "/admin"; // entra no painel
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-black text-white">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 glass p-6 rounded-2xl">
        <h1 className="text-2xl font-bold">Login do Admin</h1>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white" />
        </div>
        <div>
          <Label htmlFor="pwd">Senha</Label>
          <Input id="pwd" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} className="bg-white/10 border-white/20 text-white" />
        </div>
        {msg && <div className="text-red-300 text-sm">{msg}</div>}
        <Button disabled={loading} className="w-full">{loading ? "Entrando..." : "Entrar"}</Button>
      </form>
    </div>
  );
}
