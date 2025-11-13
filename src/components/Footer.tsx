import { Link } from "react-router-dom";
import { Mail, Instagram, Lock } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-white/10 pt-0">
      {/* Faixa Ribas centralizada */}
      <div className="w-full bg-zinc-900 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 text-center text-xs md:text-sm">
          <span className="text-foreground/70">
            Assessoria documental e regularização junto à Polícia Federal:{" "}
          </span>
          <a
            href="https://ribasdocumental.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Assessoria Documental Ribas
          </a>
        </div>
      </div>

      {/* Conteúdo principal do footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">G-TACTICAL</h3>
            <p className="text-foreground/70 text-sm mb-4">
              Escola de tiro profissional comprometida com segurança, técnica e
              responsabilidade.
            </p>

            {/* Ícones de contato */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="#contato"
                className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-foreground/60 transition-colors"
                aria-label="Contato"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/g_tacticalfhl/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-foreground/60 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#cursos"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Cursos
                </a>
              </li>
              <li>
                <a
                  href="#sobre"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="#inscricao"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Inscrição
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Contato
                </a>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="inline-flex items-center text-foreground/50 hover:text-foreground transition-colors"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span className="sr-only">Área Administrativa</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/legal/privacidade"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="/legal/termos"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="/legal/cancelamento"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Política de Cancelamento
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
{/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-foreground/50 text-center">
            Nossos conteúdos focam em segurança, responsabilidade e conformidade
            legal. Todo treinamento segue as normas vigentes e prioriza a
            preservação de vidas.
          </p>
        </div>
{/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-foreground/50 text-center">
            <p>© {currentYear} G-TACTICAL. Todos os direitos reservados.</p>
            <p className="text-xs">
            Operamos com foco em segurança, responsabilidade e conformidade
            legal.
          </p>
          </p>
        </div>
      </div>
    </footer>
  );
};
