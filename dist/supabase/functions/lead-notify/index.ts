// @ts-nocheck

/// <reference lib="deno.ns" />

// supabase/functions/lead-notify/index.ts
// Deno runtime (Supabase Edge Functions) — envia e-mail via Resend quando há INSERT em public.leads.

type LeadRecord = {
  id: string;
  course_id: string | null;
  schedule_id: string | null;
  full_name: string;
  birth_date: string; // YYYY-MM-DD
  cpf: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  observations: string | null;
  terms_accepted: boolean;
  recording_authorized: boolean;
  status: string;
  source: string;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_EMAIL   = Deno.env.get("NOTIFY_EMAIL")!;
const FROM_EMAIL     = Deno.env.get("FROM_EMAIL")!;

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json();
    const record: LeadRecord | undefined = payload?.record;
    if (!record) return new Response("missing record", { status: 400 });

    const subject = `Nova inscrição – ${record.full_name} (${record.city}/${record.state})`;
    const lines = [
      `CURSO_ID: ${record.course_id ?? "-"}`,
      `TURMA_ID: ${record.schedule_id ?? "-"}`,
      "",
      "DADOS DO ALUNO:",
      `Nome: ${record.full_name}`,
      `Nascimento: ${record.birth_date}`,
      `CPF: ${record.cpf}`,
      `Telefone: ${record.phone}`,
      `Email: ${record.email}`,
      `Cidade/UF: ${record.city}/${record.state}`,
      "",
      "OBSERVAÇÕES:",
      `${record.observations || "Nenhuma"}`,
      "",
      "CONSENTIMENTOS:",
      `Aceito Termos: ${record.terms_accepted ? "Sim" : "Não"}`,
      `Aceito Gravação: ${record.recording_authorized ? "Sim" : "Não"}`,
      "",
      `Status: ${record.status} | Origem: ${record.source}`,
      `IP: ${record.ip_address ?? "-"} | UA: ${record.user_agent ?? "-"}`,
      `Data/Hora: ${record.created_at}`,
    ];

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,               // remetente verificado no Resend
        to: [NOTIFY_EMAIL],             // destino
        subject,
        text: lines.join("\n"),
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("Resend error:", res.status, t);
      return new Response("email send failed", { status: 502 });
    }

    return new Response("ok");
  } catch (e) {
    console.error("lead-notify error:", e);
    return new Response("error", { status: 500 });
  }
});
