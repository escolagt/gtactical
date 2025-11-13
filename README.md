# G-TACTICAL - Landing Page

Landing page profissional para a escola de tiro G-TACTICAL com formulário de inscrição integrado ao Google Sheets e painel administrativo.

## 🚀 Características

- **Design Moderno**: Fundo preto absoluto com paleta amarelo/verde WhatsApp
- **Totalmente Responsivo**: Otimizado para mobile, tablet e desktop
- **Formulário Integrando**: Envia dados diretamente para Google Sheets via Apps Script
- **Painel Admin**: Dashboard básico para visualizar inscrições (MVP)
- **SEO Otimizado**: Meta tags, Open Graph, JSON-LD
- **Acessível**: WCAG 2.1 compliant com navegação por teclado
- **Animações Suaves**: Framer Motion com respeito a `prefers-reduced-motion`

## 📦 Stack Tecnológica

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Framer Motion** (animations)
- **shadcn/ui** (components)
- **Recharts** (dashboard charts)
- **React Router** (navigation)

## 🛠️ Setup Inicial


# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O site estará disponível em `http://localhost:8080`

### 2. Configurar Google Apps Script

**Passo a passo:**

1. Acesse [script.google.com](https://script.google.com)
2. Crie um novo projeto
3. Copie todo o conteúdo de `/scripts/apps_script.gs` e cole no editor
4. **IMPORTANTE**: Na linha 12, substitua o email de notificação:
   ```javascript
   const NOTIFY_EMAIL = 'seu-email@exemplo.com';
   ```
5. Clique em **Deploy** → **New deployment**
6. Escolha tipo: **Web app**
7. Configurações:
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Clique em **Deploy** e copie a **URL do Web App**
9. Cole a URL em `src/lib/constants.ts`:
   ```typescript
   export const APPS_SCRIPT_URL = 'SUA_URL_AQUI';
   ```

### 3. Configurar WhatsApp

Em `src/lib/constants.ts`, atualize o número do WhatsApp:

```typescript
export const WA_NUMBER = '5542999999999'; // Formato: código país + DDD + número
```

### 4. Trocar Assets (Opcional)

**Hero Image:**
- Substitua `/public/posters/hero.webp`
- Dimensões recomendadas: 1920×1080px
- Formato: WebP (otimizado)

**Course Placeholders:**
- Substitua `/public/posters/course_placeholder.webp`
- Dimensões: 1200×800px

**Logo:**
- Adicione `/public/logo.svg` (ou PNG)
- Dimensões: altura de 140px recomendada

**Modelos 3D** (futuro):
- Adicione arquivos `.glb` em `/public/models/`
- Integre biblioteca model-viewer conforme comentários no código

## 📊 Google Analytics (GA4)

1. Crie uma propriedade GA4
2. Copie o ID de medição (G-XXXXXXXXXX)
3. Atualize em `src/lib/analytics.ts`:
   ```typescript
   export const GA_TRACKING_ID = 'G-XXXXXXXXXX';
   ```
4. Adicione o script do GA4 no `index.html`:
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

## 🎨 Personalização de Design

Todo o design é centralizado em:

- **`src/index.css`**: Variáveis CSS (cores, tokens)
- **`tailwind.config.ts`**: Configuração do Tailwind

### Trocar Cores

Em `src/index.css`, edite as variáveis HSL:

```css
:root {
  --primary: 45 100% 65%;        /* Amarelo principal */
  --whatsapp: 142 70% 49%;       /* Verde WhatsApp */
  --background: 0 0% 0%;         /* Preto absoluto */
}
```

## 🚢 Deploy

### Vercel (Recomendado)

```bash
npm run build
npx vercel --prod
```

Ou conecte o repositório GitHub diretamente na [Vercel](https://vercel.com).

### Netlify

```bash
npm run build
npx netlify deploy --prod
```

Ou arraste a pasta `dist/` para [Netlify Drop](https://app.netlify.com/drop).

## 🔐 Segurança

- ✅ Validação client-side completa
- ✅ Sanitização no Apps Script
- ✅ Honeypot anti-spam
- ✅ HTTPS obrigatório (configure no deploy)
- ⚠️ **TODO**: Implementar autenticação no painel admin

## 📱 SEO & Performance

- **Lighthouse Score Target**: 90+ em todas as categorias
- **Core Web Vitals**: Otimizado
- **Sitemap**: Adicione em `/public/sitemap.xml` (gerar manualmente)
- **Robots.txt**: Já configurado em `/public/robots.txt`

## 🧪 Checklist Pré-Launch

- [ ] Substituir `APPS_SCRIPT_URL` em `constants.ts`
- [ ] Testar formulário (envio e recebimento no Google Sheets)
- [ ] Atualizar número do WhatsApp
- [ ] Configurar GA4 e testar eventos
- [ ] Trocar hero.webp e logo.svg
- [ ] Revisar SEO (title, description, og:image)
- [ ] Testar em dispositivos móveis
- [ ] Validar acessibilidade (navegação por teclado)

## 🆘 Suporte

**Documentação Técnica:**
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Apps Script](https://developers.google.com/apps-script)

**Assessoria Documental:**
- [Ribas](https://ribasdocumental.com.br)

## 📄 Licença

© 2025 G-TACTICAL. Todos os direitos reservados.

---

**Desenvolvido com foco em segurança, performance e experiência do usuário.** 🎯
