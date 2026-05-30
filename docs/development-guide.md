# Guia de Desenvolvimento

> Gerado em: 2026-05-29 | Modo: initial_scan | Nível: deep

## Pré-requisitos

| Ferramenta | Versão | Nota |
|------------|--------|------|
| Node.js | 14+ | Compatível com Next.js 12 |
| npm | 6+ | Gerenciador de pacotes |
| Backend WordPress | — | API em `API_BASEURL` configurada no `.env` |

## Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd congressogestaltrj.com.br-app-evento

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env .env.local
# Editar .env.local com os valores corretos
```

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `API_BASEURL` | URL base do WordPress API | `https://app.congressogestaltrj.com.br` |
| `GOOGLE_OAUTH_ID` | Client ID do Google OAuth | — |
| `FACEBOOK_OAUTH_ID` | App ID do Facebook | — |
| `ONESIGNAL_ID` | App ID do OneSignal | — |
| `ONESIGNAL_SUBDOMAINNAME` | Subdomínio OneSignal | — |
| `GA_ID` | Google Analytics tracking ID | — |
| `SUPER_USERS_IDS` | IDs de super admins (comma-separated) | `1,5` |

## Comandos

### Desenvolvimento

```bash
npm run dev          # Servidor de desenvolvimento (http://localhost:3000)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run export       # Exportar como site estático
```

### Testes

```bash
npm test             # Executar testes
npm run test:watch   # Testes em modo watch
npm run coverage     # Relatório de cobertura
npm run test:clearcache  # Limpar cache do Jest
```

## Estrutura do Projeto

```
pages/           → Rotas (Next.js Pages Router)
components/      → Componentes React
src/http/        → Serviços de API (Axios + WP classes)
src/resources/   → Modelos de domínio
src/store/       → Redux store (auth, UI)
src/types/       → TypeScript types
styles/          → SCSS global e modular
public/          → Assets estáticos e traduções
```

## Padrões e Convenções

### Adicionar nova página

1. Criar arquivo em `pages/` (ou subdiretório para rotas dinâmicas)
2. Para páginas protegidas, envolver com `privateRoute`:
   ```tsx
   import privateRoute from '../components/hoc/private-route'
   export default privateRoute(MyPage)
   ```
3. Para controle de acesso, usar `<Ac>` component:
   ```tsx
   <Ac requires={[REQUIREMENTS.abstract.manage]}>
     <AdminContent />
   </Ac>
   ```

### Adicionar novo endpoint de API

1. Criar classe em `src/http/wp-{domain}.tsx`
2. Usar `restApi` para REST ou `httpApi` para GraphQL
3. Importar `RESTVersion` para namespace
4. Adicionar type em `src/types/`

### Adicionar novo hook de dados

1. Criar arquivo em `components/hooks/use{Domain}.tsx`
2. Usar `useQuery` do React Query com query key única
3. Retornar o resultado completo do query para flexibilidade

### Formulários

- **Preferido:** Formik + Yup (ver componentes em `components/ui/form/formik/`)
- **Legado:** Redux Form (evitar, usado apenas em `my-form.tsx`)

### Estilização

- SCSS com variáveis em `styles/_variables.scss`
- CSS Modules para estilos scoped (ex: `*.module.scss`)
- Bootstrap 4 para grid e componentes base
- Evitar inline styles

### Internacionalização

- Usar hook `useTrans()` para tradução: `const { t } = useTrans()`
- Adicionar chaves em `public/locales/pt/translation.json`
- Campos multilíngue usam sufixo `_pt`, `_en`, `_es`

## Roles do Sistema

| Role WP | Nome no sistema | Permissões |
|---------|----------------|------------|
| `administrator` | Admin | Acesso total |
| `editor` | Comissão Organizadora | Gerencia resumos, usuários, atividades |
| `contributor` | Parecerista | Avalia resumos atribuídos |
| `subscriber` | Participante | Submete resumos, inscreve-se em atividades |
| `suporte` | Suporte | Suporte |
| `shop_manager` | Shop Manager | Gerencia resumos e produtos |

## Depuração

- **Redux DevTools:** Disponível em desenvolvimento via Chrome extension
- **React Query Devtools:** `<ReactQueryDevtools initialIsOpen/>` no `_app.tsx`
- **Debug component:** `dump(data)` renderiza `<pre>` com JSON em dev
- **URL debug:** `?debug` query param ativa dump em produção
- **Sentry:** Error tracking ativo com `tracesSampleRate: 0.5`

## Fluxo de Dados Típico

### Submissão de Resumo

1. Usuário acessa `/abstracts/new`
2. `useSettings()` carrega config da edição
3. `AbstractForm` renderiza campos dinâmicos baseado na config
4. Submit chama `WpAbstract.update(data)` via REST
5. React Query invalida cache de `abstracts`
6. Toast de sucesso/notificação

### Avaliação de Resumo

1. Parecerista acessa `/evaluations`
2. `useEvaluations()` lista avaliações pendentes
3. Clica em avaliação → `/evaluations/[id]`
4. `EvaluationForm` renderiza critérios da edição
5. Submit chama `WpEvaluation.update(id, data)` via REST
6. React Query invalida cache
