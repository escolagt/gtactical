// src/components/LeadForm.tsx
import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { cn } from "@/lib/utils";
import {
  validateCPF,
  validatePhone,
  validateEmail,
  validateAge,
  formatCPF,
  formatPhone,
  sanitizeInput,
} from "@/lib/form";
import { trackLeadSubmit } from "@/lib/analytics";
import type { Lead } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { fetchCoursesActive, fetchSchedulesOpen } from "@/data/courses";

export const LeadForm = () => {
  const { ref, isVisible } = useIntersectionReveal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] =
    useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cursos e Turmas (carregados do banco)
  const [courses, setCourses] = useState<
    Array<{ id: string; title: string; level?: string }>
  >([]);
  const [schedules, setSchedules] = useState<
    Array<{ id: string; courseId: string; date: string; location: string }>
  >([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

  // Carrega cursos ativos ao montar
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoadingCourses(true);
        const data = await fetchCoursesActive();
        if (!alive) return;
        setCourses(
          data.map((c: any) => ({
            id: c.id,
            title: c.title,
            level: c.level, // opcional
          }))
        );
      } catch (e) {
        console.error("Erro ao carregar cursos:", e);
      } finally {
        if (alive) setIsLoadingCourses(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Carrega turmas abertas (todas) ao montar
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoadingSchedules(true);
        const data = await fetchSchedulesOpen(); // todas as abertas/futuras
        if (!alive) return;
        setSchedules(data);
      } catch (e) {
        console.error("Erro ao carregar turmas:", e);
      } finally {
        if (alive) setIsLoadingSchedules(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleInputChange = (field: keyof Lead, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.curso) newErrors.curso = "Selecione um curso";
    if (!formData.turma) newErrors.turma = "Selecione uma turma";
    if (!formData.nome || formData.nome.length < 3)
      newErrors.nome = "Nome completo é obrigatório";
    if (!formData.dataNascimento)
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
    else if (!validateAge(formData.dataNascimento))
      newErrors.dataNascimento = "Idade mínima: 18 anos";
    if (!formData.cpf) newErrors.cpf = "CPF é obrigatório";
    else if (!validateCPF(formData.cpf)) newErrors.cpf = "CPF inválido";
    if (!formData.telefone) newErrors.telefone = "Telefone é obrigatório";
    else if (!validatePhone(formData.telefone))
      newErrors.telefone = "Telefone inválido";
    if (!formData.email) newErrors.email = "E-mail é obrigatório";
    else if (!validateEmail(formData.email)) newErrors.email = "E-mail inválido";
    if (!formData.cidade) newErrors.cidade = "Cidade é obrigatória";
    if (!formData.uf) newErrors.uf = "UF é obrigatório";
    if (!formData.aceitoTermos)
      newErrors.aceitoTermos = "Você deve aceitar os termos";
    if (!formData.aceitoGravacao)
      newErrors.aceitoGravacao = "Você deve autorizar a gravação";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ⬇⬇⬇ FUNÇÃO ATUALIZADA AQUI ⬇⬇⬇
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage("Por favor, corrija os erros no formulário");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSubmitStatus("idle");

    try {
      const payload = {
        course_id: formData.curso || null, // UUID do curso (ou null)
        schedule_id: formData.turma || null, // UUID da turma (ou null)
        full_name: sanitizeInput(formData.nome || ""),
        birth_date: formData.dataNascimento || "",
        cpf: (formData.cpf || "").replace(/\D/g, ""),
        phone: (formData.telefone || "").replace(/\D/g, ""),
        email: sanitizeInput(formData.email || "").toLowerCase(),
        city: sanitizeInput(formData.cidade || ""),
        state: sanitizeInput(formData.uf || "").toUpperCase(),
        observations: sanitizeInput(formData.observacoes || ""),
        terms_accepted: !!formData.aceitoTermos,
        recording_authorized: !!formData.aceitoGravacao,
        status: "novo" as const,
        source: "website",
        user_agent: navigator.userAgent,
      };

      // 1) salva no Supabase e retorna o registro inserido
      const { data, error } = await supabase
        .from("leads")
        .insert(payload)
        .select()
        .maybeSingle();

      if (error || !data) {
        throw error || new Error("Lead não retornado pelo insert");
      }

      // 2) dispara a Edge Function de notificação por e-mail
      try {
        await supabase.functions.invoke("lead-notify", {
          body: { record: data },
        });
      } catch (err) {
        console.error("Erro ao disparar lead-notify:", err);
        // não derruba o fluxo – lead já está salvo
      }

      // 3) status de sucesso + analytics
      setSubmitStatus("success");
      trackLeadSubmit(String(formData.curso || "")); // mantém seu analytics

      // 4) limpa formulário
      setFormData({});
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitStatus("error");
      setErrorMessage(
        "Erro ao enviar formulário. Por favor, tente novamente ou entre em contato via WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // ⬆⬆⬆ FIM DO HANDLE SUBMIT ATUALIZADO ⬆⬆⬆

  return (
    <section
      id="inscricao"
      ref={ref}
      className={cn("py-20 bg-background", isVisible && "reveal-in")}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              INSCRIÇÃO
            </h2>
            <p className="text-lg text-foreground/70">
              Preencha o formulário abaixo para garantir sua vaga
            </p>
          </div>

          {submitStatus === "success" ? (
            <div
              className="glass rounded-2xl p-8 text-center"
              role="alert"
              aria-live="polite"
            >
              <CheckCircle2 className="h-16 w-16 text-[#E5E5E5] mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold mb-2">
                Inscrição Enviada!
              </h3>
              <p className="text-foreground/70 mb-6">
                Recebemos sua inscrição e entraremos em contato em breve para
                confirmar sua vaga.
              </p>
              <Button
                onClick={() => setSubmitStatus("idle")}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Fazer nova inscrição
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-6 md:p-8 space-y-6"
            >
              {/* Course Selection */}
              <div className="space-y-2">
                <Label htmlFor="curso">Curso desejado *</Label>
                <Select
                  value={(formData.curso as string) || ""}
                  onValueChange={(value) => handleInputChange("curso", value)}
                >
                  <SelectTrigger
                    id="curso"
                    disabled={isLoadingCourses}
                    className={cn(
                      "focus-ring",
                      errors.curso && "border-destructive"
                    )}
                    aria-describedby={errors.curso ? "curso-error" : undefined}
                  >
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                        {course.level ? ` (${course.level})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.curso && (
                  <p
                    id="curso-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.curso}
                  </p>
                )}
              </div>

              {/* Schedule Selection */}
              <div className="space-y-2">
                <Label htmlFor="turma">Turma/Data *</Label>
                <Select
                  value={(formData.turma as string) || ""}
                  onValueChange={(value) => handleInputChange("turma", value)}
                >
                  <SelectTrigger
                    id="turma"
                    disabled={isLoadingSchedules}
                    className={cn(
                      "focus-ring",
                      errors.turma && "border-destructive"
                    )}
                    aria-describedby={errors.turma ? "turma-error" : undefined}
                  >
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules
                      .filter((s) => !formData.curso || s.courseId === formData.curso)
                      .map((schedule) => (
                        <SelectItem key={schedule.id} value={schedule.id}>
                          {new Date(schedule.date).toLocaleDateString("pt-BR")}{" "}
                          — {schedule.location}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.turma && (
                  <p
                    id="turma-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.turma}
                  </p>
                )}
              </div>

              {/* Personal Info */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome || ""}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className={cn("focus-ring", errors.nome && "border-destructive")}
                  aria-describedby={errors.nome ? "nome-error" : undefined}
                />
                {errors.nome && (
                  <p id="nome-error" className="text-sm text-destructive" role="alert">
                    {errors.nome}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento || ""}
                    onChange={(e) =>
                      handleInputChange("dataNascimento", e.target.value)
                    }
                    className={cn(
                      "focus-ring",
                      errors.dataNascimento && "border-destructive"
                    )}
                    aria-describedby={
                      errors.dataNascimento ? "dataNascimento-error" : undefined
                    }
                  />
                  {errors.dataNascimento && (
                    <p
                      id="dataNascimento-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.dataNascimento}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={formData.cpf || ""}
                    onChange={(e) =>
                      handleInputChange("cpf", formatCPF(e.target.value))
                    }
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={cn("focus-ring", errors.cpf && "border-destructive")}
                    aria-describedby={errors.cpf ? "cpf-error" : undefined}
                  />
                  {errors.cpf && (
                    <p id="cpf-error" className="text-sm text-destructive" role="alert">
                      {errors.cpf}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone || ""}
                    onChange={(e) =>
                      handleInputChange("telefone", formatPhone(e.target.value))
                    }
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className={cn(
                      "focus-ring",
                      errors.telefone && "border-destructive"
                    )}
                    aria-describedby={errors.telefone ? "telefone-error" : undefined}
                  />
                  {errors.telefone && (
                    <p
                      id="telefone-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.telefone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={cn(
                      "focus-ring",
                      errors.email && "border-destructive"
                    )}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    type="text"
                    value={formData.cidade || ""}
                    onChange={(e) => handleInputChange("cidade", e.target.value)}
                    className={cn(
                      "focus-ring",
                      errors.cidade && "border-destructive"
                    )}
                    aria-describedby={errors.cidade ? "cidade-error" : undefined}
                  />
                  {errors.cidade && (
                    <p
                      id="cidade-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.cidade}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uf">UF *</Label>
                  <Input
                    id="uf"
                    type="text"
                    value={formData.uf || ""}
                    onChange={(e) =>
                      handleInputChange("uf", e.target.value.toUpperCase())
                    }
                    maxLength={2}
                    placeholder="PR"
                    className={cn("focus-ring", errors.uf && "border-destructive")}
                    aria-describedby={errors.uf ? "uf-error" : undefined}
                  />
                  {errors.uf && (
                    <p id="uf-error" className="text-sm text-destructive" role="alert">
                      {errors.uf}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes || ""}
                  onChange={(e) =>
                    handleInputChange("observacoes", e.target.value)
                  }
                  rows={3}
                  className="focus-ring"
                />
              </div>

              {/* Honeypot */}
              <input type="hidden" name="_gotcha" style={{ display: "none" }} />

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="aceitoTermos"
                    checked={!!formData.aceitoTermos}
                    onCheckedChange={(checked) =>
                      handleInputChange("aceitoTermos", !!checked)
                    }
                    className={cn(errors.aceitoTermos && "border-destructive")}
                    aria-describedby={
                      errors.aceitoTermos ? "aceitoTermos-error" : undefined
                    }
                  />
                  <Label htmlFor="aceitoTermos" className="text-sm cursor-pointer">
                    Aceito os{" "}
                    <a
                      href="/termos-de-uso"
                      className="text-white underline decoration-white/40 hover:decoration-white/70"
                      target="_blank"
                    >
                      termos de uso
                    </a>{" "}
                    e a{" "}
                    <a
                      href="/politica-de-privacidade"
                      className="text-white underline decoration-white/40 hover:decoration-white/70"
                      target="_blank"
                    >
                      política de privacidade
                    </a>{" "}
                    *
                  </Label>
                </div>
                {errors.aceitoTermos && (
                  <p
                    id="aceitoTermos-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.aceitoTermos}
                  </p>
                )}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="aceitoGravacao"
                    checked={!!formData.aceitoGravacao}
                    onCheckedChange={(checked) =>
                      handleInputChange("aceitoGravacao", !!checked)
                    }
                    className={cn(
                      errors.aceitoGravacao && "border-destructive"
                    )}
                    aria-describedby={
                      errors.aceitoGravacao ? "aceitoGravacao-error" : undefined
                    }
                  />
                  <Label
                    htmlFor="aceitoGravacao"
                    className="text-sm cursor-pointer"
                  >
                    Autorizo gravação de imagem/vídeo durante o curso para fins de
                    registro e segurança *
                  </Label>
                </div>
                {errors.aceitoGravacao && (
                  <p
                    id="aceitoGravacao-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.aceitoGravacao}
                  </p>
                )}
              </div>

              {/* Legal Notice */}
              <div className="bg-white/[0.06] border border-white/15 rounded-lg p-4 text-sm text-white/80">
                <AlertCircle className="h-4 w-4 inline mr-2 text-white/70" />
                Seus dados serão tratados com confidencialidade conforme a LGPD.
                Usaremos apenas para comunicação relacionada ao curso.
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white/[0.08] text-white border border-white/20 hover:bg-white/[0.12] font-semibold text-lg py-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar inscrição"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
