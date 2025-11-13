import { useEffect, useState } from "react";
import { AdminNav } from "../components/AdminNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type SettingsState = {
  siteName: string;
  email: string;
  whatsapp: string;
  mapsUrl: string;
  notifyEmail: string;
  notifications: boolean;
};

const Settings = () => {
  const { toast } = useToast();

  const [settings, setSettings] = useState<SettingsState>({
    siteName: "G-TACTICAL",
    email: "contato@g-tactical.com.br",
    whatsapp: "(43) 99999-0000",
    mapsUrl: "https://maps.google.com/?q=Clube+de+Tiro+Massada,+Imbaú,+PR",
    notifyEmail: "contato@g-tactical.com.br",
    notifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    field: keyof SettingsState,
    value: string | boolean
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value as any }));
  };

  // Carrega configurações da tabela site_settings
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar configurações:", error);
        toast({
          title: "Erro ao carregar",
          description:
            "Não foi possível carregar as configurações. Verifique o Supabase.",
          variant: "destructive",
        });
      } else if (data) {
        setSettings((prev) => ({
          ...prev,
          siteName: data.site_name || prev.siteName,
          email: data.contact_email || prev.email,
          whatsapp: data.whatsapp || prev.whatsapp,
          mapsUrl: data.maps_url || prev.mapsUrl,
          notifyEmail:
            data.notify_email || data.contact_email || prev.notifyEmail,
          notifications:
            typeof data.notify_new_lead === "boolean"
              ? data.notify_new_lead
              : prev.notifications,
        }));
      }

      setLoading(false);
    };

    loadSettings();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        id: "main",
        site_name: settings.siteName,
        contact_email: settings.email,
        whatsapp: settings.whatsapp,
        maps_url: settings.mapsUrl,
        notify_email: settings.notifyEmail,
        notify_new_lead: settings.notifications,
      };

      // 1) Tenta atualizar a linha existente
      const { data: updated, error: updateError } = await supabase
        .from("site_settings")
        .update(payload)
        .eq("id", "main")
        .select();

      if (updateError) {
        console.error("Erro ao atualizar configurações:", updateError);
        throw updateError;
      }

      // 2) Se nenhuma linha foi atualizada, insere uma nova
      if (!updated || updated.length === 0) {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert(payload);

        if (insertError) {
          console.error("Erro ao criar configurações:", insertError);
          throw insertError;
        }
      }

      toast({
        title: "Configurações salvas",
        description: "As alterações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="text-sm text-foreground/60 mb-4">
          Dashboard / <span className="text-foreground">Configurações</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Configurações
          </h1>
          <p className="text-foreground/70">
            Ajuste as informações gerais e preferências do sistema.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <AdminNav />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            {loading && (
              <div className="glass rounded-xl p-6 text-foreground/70">
                Carregando configurações…
              </div>
            )}

            {!loading && (
              <>
                {/* Informações Gerais */}
                <div className="glass rounded-xl p-8">
                  <h2 className="font-display text-xl font-semibold mb-6 text-white/90">
                    Informações Gerais
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="siteName">Nome do sistema</Label>
                      <Input
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) =>
                          handleChange("siteName", e.target.value)
                        }
                        className="bg-white/[0.05] border-white/10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail de contato</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="bg-white/[0.05] border-white/10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={settings.whatsapp}
                        onChange={(e) =>
                          handleChange("whatsapp", e.target.value)
                        }
                        className="bg-white/[0.05] border-white/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Notificações */}
                <div className="glass rounded-xl p-8">
                  <h2 className="font-display text-xl font-semibold mb-6 text-white/90">
                    Notificações
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notifyEmail">
                        E-mail que recebe notificações
                      </Label>
                      <Input
                        id="notifyEmail"
                        type="email"
                        value={settings.notifyEmail}
                        onChange={(e) =>
                          handleChange("notifyEmail", e.target.value)
                        }
                        className="bg-white/[0.05] border-white/10"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <Label>Notificações de novas inscrições</Label>
                        <p className="text-sm text-foreground/60">
                          Receber alertas por e-mail a cada nova inscrição.
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications}
                        onCheckedChange={(val) =>
                          handleChange("notifications", val)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Salvar */}
                <div className="text-right">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white/[0.1] hover:bg-white/[0.2] border border-white/20 text-white font-semibold"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
