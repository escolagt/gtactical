import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const ContactMap = () => {
  const { settings } = useSiteSettings();

  // Valores padrão para quando ainda não mexeu no painel
  const defaultSettings = {
    site_name: "G-TACTICAL",
    whatsapp: "(43) 90000-0000",
  };

  // Se vier algo do painel, sobrescreve os padrões
  const mergedSettings = {
    ...defaultSettings,
    ...(settings ?? {}),
  };

  const phoneDisplay = mergedSettings.whatsapp;
  const phoneNumeric = phoneDisplay.replace(/\D/g, ""); // remove tudo que não for número

  return (
    <Section id="contato" variant="dark">
      <SectionHeader
        title="Entre em Contato"
        subtitle="Fale com nossa equipe e tire suas dúvidas"
      />

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Bloco de informações */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-6 flex flex-col gap-6">
          <div>
            <h3 className="font-semibold text-white text-lg">
              {mergedSettings.site_name}
            </h3>
            <p className="text-xs text-white/60">
              Treinamento tático & Regularização de armas
            </p>
          </div>

          <div className="space-y-3 text-sm text-white/75">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-white/60 mt-0.5" />
              <p>
                Parceria com{" "}
                <span className="font-medium">Clube de Tiro Massada</span>
                <br />
                Em frente à Chácara Império — PR-160, Imbaú-PR, 84250-000
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-white/60" />
              <p>{phoneDisplay}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              asChild
              className="bg-[#25D366] text-black font-semibold hover:opacity-90"
            >
              <a
                href={`https://wa.me/55${phoneNumeric}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Fale no WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Logo animada */}
        <div className="flex items-center justify-center">
          <img
            src="/escudo.png"
            alt={mergedSettings.site_name}
            className="w-full max-w-xs md:max-w-sm h-auto object-contain logo-float"
          />
        </div>
      </div>
    </Section>
  );
};
