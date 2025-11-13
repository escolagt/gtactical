import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { Award, Users, Shield, FileCheck } from "lucide-react";

export const Benefits = () => {
  const benefits = [
    {
      icon: Award,
      title: "Certificação dos Instrutores",
      description:
        "Profissionais certificados e com experiência operacional comprovada",
    },
    {
      icon: Shield,
      title: "Equipamentos Verificados",
      description:
        "Todos os equipamentos passam por inspeção rigorosa de segurança",
    },
    {
      icon: Users,
      title: "Turmas Reduzidas",
      description: "Máximo de 15 alunos por turma para atenção personalizada",
    },
    {
      icon: FileCheck,
      title: "Suporte Documental",
      description:
        "Assessoria jurídica documental da Ribas para questões legais",
    },
  ];

  return (
    <Section variant="light" id="beneficios">
      <SectionHeader
        title="Por que escolher a G-TACTICAL?"
        subtitle="Comprometimento com excelência, segurança e desenvolvimento profissional"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="glass rounded-xl p-6 text-center transition-colors hover:bg-white/[0.05]"
            >
              {/* Acentos PRATA */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D9D9D9]/15 border border-[#D9D9D9]/30 mb-4">
                <Icon className="h-8 w-8 text-[#E5E5E5]" />
              </div>

              <h3 className="font-display text-lg font-bold mb-2 text-white">
                {benefit.title}
              </h3>
              <p className="text-sm text-white/70">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
