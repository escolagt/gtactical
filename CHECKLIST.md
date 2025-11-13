# 📋 Checklist Pré-Launch G-TACTICAL

## ⚙️ Configuração Inicial

- [ ] **Google Apps Script**
  - [ ] Criar projeto no script.google.com
  - [ ] Copiar código de `/scripts/apps_script.gs`
  - [ ] Substituir `NOTIFY_EMAIL` no script
  - [ ] Deploy como Web App (acesso: Anyone)
  - [ ] Copiar URL e atualizar `src/lib/constants.ts`
  - [ ] Testar envio (abrir URL no navegador deve mostrar "API está funcionando")

- [ ] **WhatsApp**
  - [ ] Atualizar `WA_NUMBER` em `src/lib/constants.ts`
  - [ ] Testar link do WhatsApp no site

- [ ] **Google Analytics**
  - [ ] Criar propriedade GA4
  - [ ] Atualizar `GA_TRACKING_ID` em `src/lib/analytics.ts`
  - [ ] Adicionar script GA4 no `index.html`
  - [ ] Testar eventos (lead_submit, whatsapp_click)

## 🎨 Assets e Branding

- [ ] **Imagens**
  - [x] Hero image gerada (`/public/posters/hero.webp`)
  - [x] Course placeholder gerado (`/public/posters/course_placeholder.webp`)
  - [ ] Logo personalizado (`/public/logo.svg`)
  - [ ] Favicon personalizado (`/public/favicon.ico`)

- [ ] **Modelos 3D** (opcional)
  - [ ] Adicionar `hero.glb`
  - [ ] Adicionar modelos dos cursos
  - [ ] Integrar library model-viewer

## 🔍 SEO e Conteúdo

- [ ] **Meta Tags**
  - [ ] Revisar title em `index.html`
  - [ ] Revisar description
  - [ ] Atualizar og:image com URL absoluta
  - [ ] Testar com [opengraphcheck.com](https://opengraphcheck.com)

- [ ] **Conteúdo**
  - [ ] Revisar textos dos cursos
  - [ ] Atualizar depoimentos (se real)
  - [ ] Verificar agenda de turmas
  - [ ] Atualizar FAQ conforme necessidade

- [ ] **SEO Técnico**
  - [ ] Atualizar domínio no `sitemap.xml`
  - [ ] Verificar `robots.txt`
  - [ ] Adicionar structured data se necessário

## 🧪 Testes

- [ ] **Funcionalidade**
  - [ ] Navegação do header funciona
  - [ ] Todos os links internos funcionam
  - [ ] Formulário valida campos corretamente
  - [ ] Formulário envia para Google Sheets
  - [ ] Email de notificação chega
  - [ ] Links do WhatsApp abrem corretamente
  - [ ] Botão Admin leva ao dashboard

- [ ] **Responsividade**
  - [ ] Mobile (< 768px)
  - [ ] Tablet (768px - 1024px)
  - [ ] Desktop (> 1024px)
  - [ ] Menu mobile funciona

- [ ] **Acessibilidade**
  - [ ] Navegação por teclado (Tab)
  - [ ] Links têm foco visível
  - [ ] Formulário tem labels corretos
  - [ ] Imagens têm alt text
  - [ ] Teste com leitor de tela (opcional)

- [ ] **Performance**
  - [ ] Lighthouse score > 90
  - [ ] Imagens otimizadas (WebP)
  - [ ] Core Web Vitals OK

## 🚀 Deploy

- [ ] **Build**
  - [ ] Rodar `npm run build` sem erros
  - [ ] Testar build localmente (`npm run preview`)

- [ ] **Hospedagem**
  - [ ] Deploy na Vercel/Netlify
  - [ ] Configurar domínio custom (se aplicável)
  - [ ] Configurar HTTPS
  - [ ] Testar site em produção

- [ ] **Pós-Deploy**
  - [ ] Submeter sitemap ao Google Search Console
  - [ ] Configurar analytics
  - [ ] Testar formulário em produção
  - [ ] Verificar emails de notificação

## 🔒 Segurança e Legal

- [ ] **Segurança**
  - [ ] HTTPS ativado
  - [ ] Validação de formulário funcionando
  - [ ] Sanitização no Apps Script OK
  - [ ] Honeypot configurado

- [ ] **Legal**
  - [ ] Política de Privacidade revisada
  - [ ] Termos de Uso revisados
  - [ ] Política de Cancelamento revisada
  - [ ] LGPD compliance verificado

## 📊 Monitoramento

- [ ] **Analytics**
  - [ ] Google Analytics configurado
  - [ ] Eventos sendo rastreados
  - [ ] Conversões configuradas

- [ ] **Manutenção**
  - [ ] Backup da planilha do Google Sheets
  - [ ] Documentação do processo de inscrição
  - [ ] Treinamento da equipe (se aplicável)

## 🔮 Próximos Passos (Pós-MVP)

- [ ] Adicionar autenticação no painel admin
- [ ] Integrar banco de dados (Supabase)
- [ ] Sistema de gestão de turmas completo
- [ ] Exportação de relatórios
- [ ] Integração de pagamento
- [ ] Certificados digitais
- [ ] Sistema de notificações por email/SMS

---

**✅ Site pronto para lançamento quando todos os itens obrigatórios estiverem marcados!**
