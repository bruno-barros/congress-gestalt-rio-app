# Arquitetura do Sistema

> Gerado em: 2026-05-29 | Modo: initial_scan | Nível: deep

## Sumário Executivo

Aplicação web para gestão de eventos acadêmicos (congressos), construída com Next.js 12 (Pages Router) e React 17. O sistema gerencia edições de eventos, inscrições, submissão de trabalhos acadêmicos, avaliações por pares, atividades, check-in e certificados. O backend é WordPress com WPGraphQL e REST API customizada.

---

## Stack Tecnológica

| Categoria | Tecnologia | Versão | Justificativa |
|-----------|-----------|--------|---------------|
| Framework | Next.js | 12.3.4 | SSR/SSG com Pages Router |
| UI Library | React | 17.0.2 | Biblioteca de UI |
| Linguagem | TypeScript | 4.9.5 | Tipagem estática |
| State Global | Redux + Redux Thunk | 4.0.5 / 2.3.0 | Auth e UI state |
| Data Fetching | React Query | 3.6.0 | Cache, revalidação, mutations |
| HTTP Client | Axios | 0.19.2 | Chamadas ao backend WP |
| UI Framework | Bootstrap + React-Bootstrap | 4.6.0 / 1.6.8 | Layout e componentes |
| Styling | Sass | 1.69.7 | Pré-processador CSS |
| Forms | Formik + Yup | 2.2.6 / 0.32.8 | Gerenciamento de formulários |
| Auth | JWT (jwt-decode) + Cookies | — | Autenticação stateless |
| OAuth | @react-oauth/google | 0.12.2 | Login social Google |
| i18n | i18next + react-i18next | 23.0.1 / 13.0.0 | Internacionalização |
| Testing | Jest + React Testing Library | 26.6.3 | Testes unitários |
| Monitoring | Sentry | 6.1.0 | Error tracking |
| File Upload | Uppy | 1.15.0 | Upload de arquivos |
| Charts | Recharts | 2.15.0 | Gráficos estatísticos |
| Tables | react-table | 7.6.3 | Tabelas de dados com filtros |
| Animations | Framer Motion | 2.9.5 | Animações de UI |
| Notifications | SweetAlert2 + react-toastify | 10.13.0 / 6.2.0 | Alertas e toasts |
| Push | OneSignal | — | Notificações push |

---

## Padrão Arquitetural

**Arquitetura em Camadas (Client-side)** com comunicação REST/GraphQL para backend WordPress.

```
┌─────────────────────────────────────────────┐
│                  PAGES                       │
│  (Next.js Pages Router - file-based)        │
│  Rotas, autenticação, composição            │
├─────────────────────────────────────────────┤
│               COMPONENTS                     │
│  UI Primitives / Feature / Layout / HOCs    │
│  hooks/ → Custom React Query hooks          │
│  access-control/ → Sistema de permissões    │
├─────────────────────────────────────────────┤
│              DOMAIN LAYER                    │
│  resources/ → Modelos de domínio            │
│  types/ → TypeScript interfaces             │
├─────────────────────────────────────────────┤
│              STATE LAYER                     │
│  store/ → Redux (auth, UI)                  │
│  React Query Cache (domain data)            │
├─────────────────────────────────────────────┤
│              HTTP LAYER                      │
│  http/ → Axios instances + Service classes  │
│  Auth Token → JWT management                │
└─────────────────────────────────────────────┘
         │                    │
    ┌────┴────┐         ┌────┴────┐
    │ REST API│         │ GraphQL │
    │(wp-json)│         │ (/cms)  │
    └────┬────┘         └────┬────┘
         │                   │
    ┌────┴───────────────────┴────┐
    │      WordPress Backend      │
    │   (WP + WooCommerce +       │
    │    WPGraphQL + Custom API)  │
    └─────────────────────────────┘
```

---

## Data Flow

### Fluxo de Dados (Leitura)

```
Page → Custom Hook (React Query) → Service Class (src/http/wp-*.tsx)
  → Axios Instance → WordPress API → Response → Domain Model (src/resources/)
  → React Query Cache → Component Re-render
```

### Fluxo de Dados (Escrita)

```
Component → Event Handler → Service Class (mutation)
  → REST API / GraphQL → Response → React Query Invalidation → UI Update
  → Toast/SweetAlert notification
```

### Fluxo de Autenticação

```
LoginForm → postLogin() (Redux Thunk) → Wordpress.doLogin() (GraphQL)
  → JWT tokens → AuthToken.storeToken() (cookies) → Redux dispatch LOGIN_SUCCESS
  → Redirect to /dashboard
```

---

## Design de API

### Dualismo REST + GraphQL

O projeto usa duas APIs em paralelo com migração progressiva:

| Aspecto | REST API | GraphQL |
|---------|----------|---------|
| **Uso** | CRUD moderno, operações de escrita | Queries complexas, listagens com filtros |
| **Instância** | `restApi` | `httpApi` |
| **Base** | `/wp-json/event/v1/` | `/cms/index.php?graphql` |
| **Classes** | `WpActivity`, `WpTaxonomy`, `WpSettings`, etc. | `WpUser`, `WpAbstract`, `WpEvaluation` |
| **Auth** | Bearer JWT (interceptor) | Bearer JWT (interceptor) |

### Padrão de Resposta

```typescript
interface WpRestResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
```

---

## Estrutura de Componentes

### Categorias

| Categoria | Diretório | Qtd | Exemplos |
|-----------|-----------|-----|----------|
| Layout | `components/layout/` | 7 | MainLayout, ClearLayout, Header, Sidebar |
| UI Primitives | `components/ui/` | 20+ | Loading, Tooltip, BlockUi, Curtain, Sweet |
| Form Primitives | `components/ui/form/formik/` | 15+ | Text, Select, Wysiwyg, DatePicker, Mask, Phone |
| Abstract | `components/abstract/` | 24 | AbstractForm, AbstractView, EvaluationForm, modais |
| Activities | `components/activities/` | 10+ | MyActivities, AvailableActivities, SubscriptionPanel |
| Settings | `components/settings/` | 11+ | SettingsLayout, ActivityForm, TaxonomyForm |
| Reports | `components/reports/` | 7+ | SubscriptionsReports, AbstractsReports, charts |
| Hooks | `components/hooks/` | 31 | useSettings, useCurrentUser, useAbstracts, etc. |
| Access Control | `components/access-control/` | 7 | `<Ac>`, Resolver, domain resolvers |

### Sistema de Permissões

Controle de acesso declarativo com resolvers por domínio:

```tsx
<Ac requires={[REQUIREMENTS.abstract.manage]}>
  <AdminButton />
</Ac>
```

Resolvers: `Abstract`, `User`, `Subscription`, `Evaluation`, `Configuration`, `Activity`

---

## Gerenciamento de Estado

| Dados | Solução | Escopo |
|-------|---------|--------|
| Auth (user, tokens) | Redux | Global |
| UI blocking | Redux | Global |
| Formulários | Formik / Redux Form | Local |
| Dados de domínio | React Query | Cache global |
| Notificações | react-toastify / SweetAlert2 | Transient |
| i18n | i18next | Global |

---

## Roteamento

Next.js Pages Router com 40 rotas organizadas em:

| Seção | Rotas | Auth | Roles |
|-------|-------|------|-------|
| Pública | `/login`, `/logout`, `/404`, `/merging/[uuid]` | Nenhuma | — |
| Protegida | `/dashboard`, `/profile`, `/abstracts/*`, `/activities`, `/evaluations/*`, `/checkin`, `/register*` | privateRoute | subscriber+ |
| Admin | `/adm/*` | privateRoute + ac | admin, editor |
| Settings | `/settings/*` | Implícito (MainLayout) | admin, editor |

---

## Internacionalização

- **Idiomas suportados:** pt (padrão), en, es
- **Biblioteca:** i18next + react-i18next
- **Arquivos:** `public/locales/{lang}/translation.json`
- **Hook customizado:** `useTrans()`
- **Config Next.js:** `i18n: { locales: ['pt'], defaultLocale: 'pt' }`

---

## Observações de Segurança

1. **Rotas sem autenticação:** `/adm/qrcode`, `/adm/checkin/activity/[id]` e `/settings/*` não possuem `privateRoute`
2. **Credenciais hardcoded:** `user.actions.tsx` contém credenciais de debug em `logUserByType()`
3. **Strict mode desabilitado:** `tsconfig.json` tem `"strict": false`
4. **Sem response interceptor:** Erros HTTP tratados individualmente em cada chamada

---

## Estratégia de Testes

| Ferramenta | Config | Cobertura |
|------------|--------|-----------|
| Jest | `jest.config.js` com babel-jest | Configurada mas com poucos testes |
| React Testing Library | `@testing-library/react` | Disponível |
| CSS Mock | `__test__/cssTransform.js` | Para importação de estilos |
| File Mock | `__test__/fileMock.js` | Para importação de arquivos |

Scripts: `npm test`, `npm run test:watch`, `npm run coverage`
