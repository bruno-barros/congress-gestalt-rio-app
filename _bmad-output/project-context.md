---
project_name: 'conceito-evento'
user_name: 'Bruno'
date: '2026-05-29'
sections_completed:
  - technology_stack
  - language_rules
  - framework_rules
  - testing_rules
  - code_quality
  - workflow_rules
  - critical_rules
status: 'complete'
rule_count: 65
optimized_for_llm: true
---

# Project Context for AI Agents

_Este arquivo contem regras criticas e padroes que agentes de IA devem seguir ao implementar codigo neste projeto. Foco em detalhes nao-obvios que agentes poderiam ignorar._

---

## Technology Stack & Versions

### Core

| Tecnologia | Versão | Nota Critica |
|-----------|--------|------|
| Next.js (Pages Router) | 12.3.4 | **NÃO é App Router** — file-based routing em `pages/` |
| React | 17.0.2 | **Não é React 18** — sem automatic batching, sem `useId`, sem Suspense aprimorado |
| TypeScript | 4.9.5 | `"strict": false` — sem null checks rigorosos, sem `noImplicitAny` |
| Node.js | 14+ | Requisito de compatibilidade com Next.js 12 |

### Estado & Data Fetching

| Biblioteca | Versão | Papel |
|-----------|--------|-------|
| Redux + Redux Thunk | 4.0.5 / 2.3.0 | Estado global: **apenas auth e UI** |
| React Query | 3.6.0 | Cache de dados de domínio — **não é TanStack Query v5** (API diferente) |
| Axios | 0.19.2 | HTTP client com interceptors para JWT |

### UI & Styling

| Biblioteca | Versão | Papel |
|-----------|--------|-------|
| Bootstrap + React-Bootstrap | 4.6.0 / 1.6.8 | **Bootstrap 4, não 5** — classes e componentes são diferentes |
| Sass | 1.69.7 | Pré-processador CSS |
| Formik + Yup | 2.2.6 / 0.32.8 | Forms — **não usar React Hook Form** |
| Framer Motion | 2.9.5 | Animações de UI |

### Infra & Tooling

| Biblioteca | Versão | Papel |
|-----------|--------|-------|
| i18next + react-i18next | 23.0.1 / 13.0.0 | i18n — locale padrão `pt` |
| Jest + React Testing Library | 26.6.3 / 10.4.7 | Testing |
| Sentry | 6.1.0 | Error tracking |
| Moment.js | 2.29.1 | Datas (não usar date-fns ou dayjs) |

## Critical Implementation Rules

### Language-Specific Rules (TypeScript/JavaScript)

- **Extensão `.tsx` universal** — TODOS os arquivos TypeScript usam `.tsx`, inclusive não-React (store, resources, helpers, types, http services). Excessões: `.d.ts` para declarações de tipos globais e `.type.ts` para tipos de domínio em `src/types/`
- **TypeScript non-strict** — `"strict": false`. NÃO usar syntax que exige strict mode. `any` é aceito no projeto. Não adicionar `!` non-null assertions desnecessariamente
- **Imports lodash por método** — `import trimStart from 'lodash/trimStart'`. NUNCA `import _ from 'lodash'`
- **esModuleInterop ativo** — imports default de CommonJS funcionam: `import axios from 'axios'`
- **Tratamento de erros por chamada** — Sem interceptor global de erro. Cada chamada HTTP trata erros individualmente com `.then()/.catch()` ou `try/catch`
- **GraphQL response shape** — `resp.data.data.{entity}` — sempre verificar existência antes de acessar. Ex: `if(resp.data?.data?.abstract)`
- **REST response shape** — `WpRestResponse<T>` com `{ success: boolean, message: string, data?: T }`
- **try/catch silencioso** — Comum no projeto (AuthToken, resource constructors). Não logar erros automaticamente se o padrão existente é silencioso

### Framework-Specific Rules

**Next.js (Pages Router):**
- **NÃO usar App Router** — Rotas são file-based em `pages/`. NÃO criar diretório `app/`
- **`getInitialProps`** é usado em HOCs (`private-route.tsx`). NÃO misturar com `getServerSideProps` no mesmo componente
- **Variáveis de ambiente** expostas via `next.config.js` `env: {}` — acessar como `process.env.apiUrl` (NÃO `process.env.API_BASEURL` — o nome é transformado)
- **i18n config** no `next.config.js`: `locales: ['pt']`, `defaultLocale: 'pt'`

**React Hooks — Data Fetching (PADRÃO OBRIGATÓRIO):**
- **SEMPRE** criar hook em `components/hooks/use{Domain}.tsx` para fetch de dados
- **React Query v3 API** — `useQuery(['key', id], queryFn, { enabled: !!id })`. NÃO usar API v5 (`queryOptions`, estruturas diferentes)
- **Query keys**: `['entity']` para listas, `['entity', id]` para item único, `['entity', param1, param2]` para filtros
- **queryFn** encapsula chamada ao service + mapeia para resource model via `Model.make()`
- **NÃO fazer fetch direto em componentes** — sempre criar hook dedicado

**State Management — Divisão Rígida:**
- **Redux** → APENAS auth (user, token) e UI (blockUi). **NÃO** adicionar dados de domínio ao Redux
- **React Query** → Dados de domínio (abstracts, activities, evaluations, settings, users, etc.)
- **Formik** → Estado local de formulários
- **NÃO** criar novos Redux reducers para dados de domínio — usar React Query

**Componentes — Organização & Padrões:**
- Feature components em `components/{feature}/` (abstract, activities, settings, reports, etc.)
- UI primitives em `components/ui/`, campos Formik em `components/ui/form/formik/`
- Layout em `components/layout/`, HOCs em `components/hoc/`
- Resource models em `src/resources/` — classes com `static make(data)` factory + `Object.assign(this, data)` no constructor
- HTTP services em `src/http/wp-{domain}.tsx` — classes com métodos estáticos usando `restApi` ou `httpApi`

**Sistema Dual de API:**
- **`restApi`** → REST CRUD em `/wp-json/event/v1/`. Usar para: escrita, updates, deletes. Namespace via `RESTVersion.default().namespace`
- **`httpApi`** → GraphQL em `/cms/index.php?graphql`. Usar para: queries complexas com filtros, listagens, dados aninhados. Queries inline como strings
- **Ambas** usam Bearer JWT via interceptor em `axios.tsx`

**Acesso & Autenticação:**
- Páginas protegidas: `export default privateRoute(MyPage)` — HOC que verifica JWT no cookie
- Controle de acesso declarativo: `<Ac requires={[REQUIREMENTS.abstract.manage]}> conteúdo </Ac>`
- Permissões por role WP: administrator, editor, contributor(parecerista), subscriber(participante)
- Token em cookies via `AuthToken` class — chaves `gestalt.authToken` / `gestalt.refreshToken`

**Formulários:**
- **SEMPRE Formik + Yup**. Campos existentes em `components/ui/form/formik/` (Text, Select, Wysiwyg, DatePicker, Mask, Phone, Switch, Checkboxes, Tags, Authors, Attachments, Image, DateRange)
- **Redux Form é LEGADO** — NÃO usar para novos formulários

**Estilização:**
- SCSS com variáveis em `styles/_variables.scss` (`$sidebarWidth`, `$sidebarCompact`)
- CSS Modules (`.module.scss`) para estilos scoped de componentes específicos
- **Bootstrap 4** para grid e componentes base — NÃO usar classes do Bootstrap 5
- NÃO usar inline styles
- Arquivos SCSS globais com prefixo `_` (partial): `_layout-main.scss`, `_modal.scss`, etc.

**i18n:**
- Usar `useTrans()` hook (wrapper de `useTranslation`). Retorna `t` function diretamente
- Chaves em `public/locales/pt/translation.json`
- Campos multilíngue usam sufixo `_pt`, `_en`, `_es`
- `keySeparator: '.'` — chaves usam ponto como separador

### Testing Rules

- **Jest + babel-jest** — NÃO usar ts-jest. TypeScript transpilado via Babel
- **React Testing Library** para testes de componentes. NÃO usar Enzyme
- **Setup file** em `__test__/setup-tests.js` — adicionar matchers customizados aqui
- **CSS mock** via `__test__/cssTransform.js` — CSS imports retornam objeto vazio
- **CSS Modules** mapeados para `identity-obj-proxy` — `styles.foo` retorna `'foo'` em testes
- **Testes ao lado do código** — `helpers.test.tsx` em `src/`, não em `__test__/`
- **`testPathIgnorePatterns`** exclui `/node_modules/`, `/.next/`, `/__test__/` (setup files)
- **Cobertura baixa** — projeto tem poucos testes existentes. Novos testes são bem-vindos mas não exigidos
- **Scripts**: `npm test`, `npm run test:watch`, `npm run coverage`, `npm run test:clearcache`
- **NÃO usar** Vitest, Mocha ou outros runners — projeto usa Jest exclusivamente

### Code Quality & Style Rules

**Formatação (EditorConfig):**
- Indentação: **2 espaços** (não tabs) para `*.{js,ts,tsx,json}`
- Line ending: **LF** (não CRLF)
- Trim trailing whitespace: sim
- Insert final newline: sim

**Naming Conventions:**
- Arquivos: **kebab-case** — `abstract-form.tsx`, `use-abstracts.tsx`, `wp-abstract.tsx`
- Componentes: **PascalCase** — `AbstractForm`, `MyActivities`, `SettingsLayout`
- Hooks: **camelCase com prefixo use** — `useAbstract`, `useTrans`, `useCurrentUser`
- Services (HTTP): **PascalCase com prefixo Wp** — `WpAbstract`, `WpUser`, `WpSettings`
- Resources (modelos): **PascalCase sem prefixo** — `Abstract`, `Edition`, `User`
- Query keys: **strings kebab-case** — `['abstract', id]`, `['settings', null]`, `['current-user']`
- Tipos/interfaces: **PascalCase com sufixo Schema/Type** — `ActivitySchema`, `StatusType`, `WpRestResponse`

**Estrutura de Arquivos:**
- Tipos em `src/types/` — `.d.ts` para declarações globais (react-i18next, etc.), `.type.ts` para tipos de domínio
- Interface de resposta REST centralizada em `src/types/restapi.ts`
- Helpers/mocks de teste em `__test__/`
- Sem ESLint ou Prettier configurados — seguir estilo existente do codebase

**Comentários & Documentação:**
- JSDoc em métodos de service e resource importantes
- Comentários em português são comuns e aceitáveis
- `@deprecated` usado para marcar métodos legados com alternativa indicada

### Development Workflow Rules

**Comandos:**
- `npm run dev` — dev server em `http://localhost:3000`
- `npm run build` — build de produção (verificar antes de deploy)
- `npm run start` — servidor de produção
- `npm test` / `npm run test:watch` / `npm run coverage` — testes

**Variáveis de Ambiente (.env):**
- `API_BASEURL` — URL base do WordPress (ex: `https://app.congressogestaltrj.com.br`)
- `GOOGLE_OAUTH_ID`, `FACEBOOK_OAUTH_ID` — OAuth providers
- `ONESIGNAL_ID`, `ONESIGNAL_SUBDOMAINNAME` — Push notifications
- `SUPER_USERS_IDS` — IDs de super admins separados por vírgula (ex: `1,5`)
- Copiar `.env` para `.env.local` para desenvolvimento local

**Dependências:**
- Backend WordPress deve estar acessível — app não funciona sem API
- Sentry DSN está hardcoded em `_app.tsx` — não modificar
- Versão do app em `next.config.js` `env.version` — atualizar em releases

### Critical Don't-Miss Rules

**Anti-Padrões — NÃO FAZER:**
- NÃO usar React 18 APIs (`useId`, `useSyncExternalStore`, `startTransition`, `Suspense` aprimorado)
- NÃO usar Bootstrap 5 classes (`data-bs-*`, `offcanvas`, classes renomeadas como `me-*` em vez de `ml-*`)
- NÃO instalar TanStack Query v5 — projeto usa React Query v3 com API diferente
- NÃO criar Redux reducers para dados de domínio — usar React Query
- NÃO usar Redux Form para novos formulários — é legado, usar Formik + Yup
- NÃO usar `getServerSideProps` em componentes com `privateRoute` HOC (usa `getInitialProps`)
- NÃO importar lodash inteiro — sempre importar por método: `import trimStart from 'lodash/trimStart'`
- NÃO usar date-fns ou dayjs — projeto usa Moment.js
- NÃO criar diretório `app/` (App Router) — projeto usa Pages Router
- NÃO usar ts-jest — projeto usa babel-jest
- NÃO usar React Hook Form — projeto usa Formik + Yup

**Edge Cases Importantes:**
- GraphQL queries são **strings inline** — cuidado com interpolação de variáveis em template literals
- Auth token expira — `privateRoute` HOC verifica e renova. Páginas sem `privateRoute` NÃO verificam auth
- Rotas **sem proteção**: `/adm/qrcode`, `/adm/checkin/activity/[id]`, `/settings/*` — não têm `privateRoute`
- `process.env.apiUrl` (minúsculo) é o nome correto — Next.js transforma `API_BASEURL` via `env` config
- React Query default: `refetchOnMount: false`, `refetchOnWindowFocus: false` — cache persiste até invalidação manual

**Segurança:**
- JWT em cookies **sem `httpOnly`** — acessível via JS (decisão arquitetural para leitura client-side)
- Não commitar `.env.local` (no `.gitignore`)
- Credenciais de debug em `user.actions.tsx` `logUserByType()` — não expandir
- Sentry ativo com `tracesSampleRate: 0.5` — não logar dados sensíveis

**Performance:**
- `swcMinify: true` no Next.js config — não adicionar Terser
- Usar `dynamic import` do Next.js para code splitting de componentes pesados
- Lodash imports por método garantem tree-shaking adequado

---

## Usage Guidelines

**Para Agentes de IA:**
- Ler este arquivo antes de implementar qualquer código
- Seguir TODAS as regras exatamente como documentado
- Em caso de dúvida, preferir a opção mais restritiva
- Atualizar este arquivo se novos padrões surgirem

**Para Humanos:**
- Manter o arquivo enxuto e focado nas necessidades dos agentes
- Atualizar quando a stack tecnológica mudar
- Revisar trimestralmente para remover regras desatualizadas
- Remover regras que se tornem óbvias ao longo do tempo

_Last Updated: 2026-05-29_
