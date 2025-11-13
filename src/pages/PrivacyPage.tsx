// src/pages/PrivacyPage.tsx
const PrivacyPage = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">
            G-TATICAL • ESCOLA TÁTICA
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Política de Privacidade
          </h1>
          <p className="text-sm text-slate-400">
            Última atualização: 12/11/2025
          </p>
        </header>

        <section className="space-y-6 text-sm md:text-base text-slate-200 leading-relaxed">
          <p>
            Esta Política de Privacidade explica como a <strong>G-TATICAL</strong>{" "}
            coleta, utiliza, armazena e protege os dados pessoais de usuários e
            visitantes da plataforma, em conformidade com a legislação aplicável,
            incluindo a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).
          </p>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              1. Dados que Coletamos
            </h2>
            <p>Podemos coletar as seguintes informações, por exemplo:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Nome completo;</li>
              <li>Telefone e WhatsApp;</li>
              <li>E-mail;</li>
              <li>Cidade/estado;</li>
              <li>
                Informações relacionadas a cursos, treinos ou eventos de interesse;
              </li>
              <li>
                Dados técnicos básicos de acesso (endereço IP, navegador, data/hora de acesso).
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              2. Como Utilizamos seus Dados
            </h2>
            <p>
              Os dados coletados são utilizados para fins como:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Responder contatos e dúvidas enviados pelos formulários;</li>
              <li>
                Enviar informações sobre cursos, treinos, turmas e eventos
                relacionados à G-TATICAL;
              </li>
              <li>
                Gerenciar cadastros, inscrições e presença em atividades da escola;
              </li>
              <li>
                Melhorar a experiência de navegação e o desempenho da plataforma;
              </li>
              <li>
                Cumprir obrigações legais e regulatórias, quando necessário.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              3. Cookies e Tecnologias Similares
            </h2>
            <p>
              A plataforma poderá utilizar cookies e tecnologias similares para:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Registrar preferências de navegação;</li>
              <li>Gerar estatísticas de acesso e uso;</li>
              <li>Melhorar a performance e segurança do site.</li>
            </ul>
            <p>
              Você pode, a qualquer momento, ajustar as configurações do seu
              navegador para bloquear ou alertar sobre o uso de cookies, mas isso
              pode afetar algumas funcionalidades do site.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              4. Compartilhamento de Dados
            </h2>
            <p>
              A G-TATICAL não vende ou comercializa dados pessoais. Seus dados
              poderão ser compartilhados apenas:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>
                Com serviços de terceiros essenciais ao funcionamento da
                plataforma (por exemplo: hospedagem, disparo de e-mails, sistemas
                de pagamento), sempre que necessário;
              </li>
              <li>
                Para cumprimento de obrigação legal, decisão judicial ou requisição
                de autoridade competente;
              </li>
              <li>
                Mediante seu consentimento, quando exigido pela legislação.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              5. Segurança das Informações
            </h2>
            <p>
              Adotamos medidas técnicas e organizacionais razoáveis para proteger
              seus dados pessoais contra acessos não autorizados, perda, uso
              indevido ou divulgação indevida. Ainda assim, nenhum sistema é
              100% seguro, e não é possível garantir absoluta segurança na
              transmissão de informações pela internet.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              6. Direitos dos Titulares de Dados
            </h2>
            <p>
              Nos termos da LGPD, você tem, entre outros, os seguintes direitos:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Confirmar se tratamos dados pessoais a seu respeito;</li>
              <li>Acessar seus dados armazenados;</li>
              <li>
                Solicitar correção de dados incompletos, inexatos ou desatualizados;
              </li>
              <li>
                Solicitar a exclusão ou anonimização de dados desnecessários ou
                tratados em desconformidade com a lei;
              </li>
              <li>
                Revogar o consentimento, quando o tratamento se basear nele.
              </li>
            </ul>
            <p>
              Para exercer seus direitos, entre em contato pelos canais oficiais
              listados nesta plataforma.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              7. Retenção dos Dados
            </h2>
            <p>
              Manteremos seus dados pessoais pelo tempo necessário para cumprir as
              finalidades descritas nesta Política, salvo quando houver obrigação
              legal ou regulatória que exija prazo superior.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              8. Alterações nesta Política
            </h2>
            <p>
              Esta Política de Privacidade poderá ser atualizada periodicamente.
              A data da última atualização estará sempre indicada no topo da
              página.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              9. Contato
            </h2>
            <p>
              Em caso de dúvidas sobre o tratamento de seus dados pessoais ou
              sobre esta Política de Privacidade, entre em contato com a
              G-TATICAL pelos canais oficiais indicados no site.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PrivacyPage;
