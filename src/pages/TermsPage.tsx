// src/pages/TermsPage.tsx
const TermsPage = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">
            G-TACTICAL • ESCOLA TÁTICA
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Termos de Uso
          </h1>
          <p className="text-sm text-slate-400">
            Última atualização: 12/11/2025
          </p>
        </header>

        <section className="space-y-6 text-sm md:text-base text-slate-200 leading-relaxed">
          <p>
            Bem-vindo à plataforma <strong>G-TACTICAL</strong>. Ao acessar e utilizar
            este site, você concorda com os termos e condições descritos abaixo.
            Caso não concorde com algum ponto, recomendamos que não utilize a
            plataforma.
          </p>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              1. Objetivo da Plataforma
            </h2>
            <p>
              A plataforma G-TACTICAL tem como objetivo divulgar cursos, treinos,
              eventos e conteúdos relacionados à formação tática, tiro esportivo
              e segurança, bem como facilitar o contato entre a escola e os
              alunos/interessados.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              2. Cadastro e Acesso
            </h2>
            <p>
              Algumas áreas do sistema podem exigir cadastro. Ao se cadastrar,
              você se compromete a:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Fornecer informações verdadeiras, completas e atualizadas;</li>
              <li>
                Não compartilhar seu acesso com terceiros sem autorização;
              </li>
              <li>
                Manter a confidencialidade de seu login e senha.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              3. Responsabilidades do Usuário
            </h2>
            <p>Ao utilizar a plataforma, você concorda em NÃO:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Utilizar o sistema para fins ilícitos ou não autorizados;</li>
              <li>
                Tentar acessar áreas restritas sem permissão ou violar medidas de segurança;
              </li>
              <li>
                Publicar, enviar ou compartilhar conteúdos ofensivos, ilegais ou
                que ferem direitos de terceiros.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              4. Conteúdos, Cursos e Informações
            </h2>
            <p>
              As informações sobre cursos, treinos, horários, valores e conteúdos
              podem ser atualizadas a qualquer momento, sem aviso prévio. A
              G-TACTICAL reserva-se o direito de:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Alterar, suspender ou cancelar cursos e eventos;</li>
              <li>Atualizar valores e condições de pagamento;</li>
              <li>
                Ajustar requisitos mínimos para participação, conforme legislação
                e normas de segurança.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              5. Propriedade Intelectual
            </h2>
            <p>
              Todo o conteúdo desta plataforma (textos, imagens, logotipos,
              materiais didáticos, vídeos, identidade visual etc.) é de
              propriedade da <strong>G-TACTICAL</strong> ou utilizado mediante
              autorização, sendo protegido por leis de direitos autorais e
              propriedade intelectual.
            </p>
            <p>
              É proibida a reprodução, distribuição, modificação ou qualquer uso
              não autorizado desse conteúdo sem autorização prévia e por escrito.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              6. Limitação de Responsabilidade
            </h2>
            <p>
              A G-TACTICAL não se responsabiliza por:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>
                Danos decorrentes de uso indevido da plataforma ou das
                informações aqui disponibilizadas;
              </li>
              <li>
                Instabilidade, indisponibilidade ou falhas técnicas de
                conexão, servidores ou provedores externos;
              </li>
              <li>
                Ações tomadas pelos usuários com base nas informações publicadas,
                sem a devida orientação técnica ou legal.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              7. Alterações nos Termos
            </h2>
            <p>
              Estes Termos de Uso podem ser atualizados periodicamente para se
              adequar a mudanças legais, técnicas ou operacionais. Recomendamos
              que você revise esta página sempre que utilizar a plataforma.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-emerald-400">
              8. Contato
            </h2>
            <p>
              Em caso de dúvidas sobre estes Termos de Uso, você pode entrar em
              contato pelos canais oficiais da G-TACTICAL, como e-mail ou
              WhatsApp informados na página principal.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TermsPage;
