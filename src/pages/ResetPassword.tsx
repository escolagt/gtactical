import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Step = "checking" | "form" | "success" | "error";

const ResetPassword = () => {
  const [step, setStep] = useState<Step>("checking");
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Quando o usuário cai aqui pelo link de recuperação,
  // o Supabase já cria uma sessão (type=recovery).
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setError("Link inválido ou expirado. Peça uma nova redefinição de senha.");
        setStep("error");
        return;
      }
      setStep("form");
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || password.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error(error);
      setError("Erro ao atualizar senha. Tente novamente.");
      return;
    }

    setStep("success");
  };

  if (step === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/70">Verificando link de redefinição…</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full glass rounded-xl p-6 border border-white/10 text-center">
          <h1 className="font-display text-2xl font-bold mb-3 text-white">
            Senha atualizada com sucesso
          </h1>
          <p className="text-foreground/70 mb-6">
            Agora você já pode acessar o painel com sua nova senha.
          </p>
          <Button
            className="bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] text-white"
            onClick={() => (window.location.href = "/")}
          >
            Voltar para o site
          </Button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full glass rounded-xl p-6 border border-red-500/30">
          <h1 className="font-display text-2xl font-bold mb-3 text-red-200">
            Erro na redefinição
          </h1>
          <p className="text-foreground/70 mb-4">
            {error ?? "Link inválido ou expirado. Peça um novo e-mail de recuperação."}
          </p>
          <Button
            className="bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] text-white"
            onClick={() => (window.location.href = "/")}
          >
            Voltar para o site
          </Button>
        </div>
      </div>
    );
  }

  // step === "form"
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full glass rounded-xl p-6 border border-white/10">
        <h1 className="font-display text-2xl font-bold mb-4 text-white">
          Redefinir senha
        </h1>
        <p className="text-sm text-foreground/70 mb-6">
          Defina uma nova senha para acessar o painel administrativo.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirm">Confirmar nova senha</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] text-white"
          >
            Salvar nova senha
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
