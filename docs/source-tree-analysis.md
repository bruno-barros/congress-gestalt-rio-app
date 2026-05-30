# Análise da Árvore de Código-Fonte

> Gerado em: 2026-05-29 | Modo: initial_scan | Nível: deep

## Estrutura do Projeto

```
congressogestaltrj.com.br-app-evento/
├── pages/                          # Rotas Next.js (Pages Router)
│   ├── _app.tsx                    # [ENTRY] App shell: Redux, React Query, i18n, Sentry, GA
│   ├── _document.tsx               # [ENTRY] HTML shell: scripts externos (GA, Ionicons)
│   ├── 404.tsx                     # Página 404 customizada
│   ├── index.tsx                   # Home (dev login) → redireciona para /login em produção
│   ├── login.tsx                   # Login com email/senha + Google OAuth
│   ├── logout.tsx                  # Limpa sessão e redireciona
│   ├── dashboard.tsx               # Dashboard principal com cards de edições
│   ├── profile.tsx                 # Perfil do usuário (tabs: dados, inscrições, certificados, docs)
│   ├── register1.tsx               # Registro passo 1: dados pessoais
│   ├── register2.tsx               # Registro passo 2: inscrição/pagamento
│   ├── register3.tsx               # Registro passo 3: docs ações afirmativas
│   ├── adm/                        # [ADMIN] Área administrativa
│   │   ├── abstracts.tsx           # Gerenciar todos os resumos
│   │   ├── activities.tsx          # Gerenciar atividades
│   │   ├── subscriptions.tsx       # Gerenciar inscrições/pedidos
│   │   ├── evaluations.tsx         # Gerenciar avaliações
│   │   ├── users.tsx               # Gerenciar usuários
│   │   ├── reports.tsx             # Dashboard de estatísticas
│   │   ├── manage.tsx              # Anais + Push notifications
│   │   ├── certificates.tsx        # Certificados gerados
│   │   ├── qrcode.tsx              # Gerador de QR Code para check-in
│   │   └── checkin/                # Gerenciamento de check-in
│   │       ├── index.tsx           # Lista de atividades para check-in
│   │       └── activity/[id].tsx   # Check-in de participantes por atividade
│   ├── abstracts/                  # Resumos/trabalhos acadêmicos
│   │   ├── index.tsx               # Meus resumos
│   │   ├── new.tsx                 # Novo resumo
│   │   └── [id].tsx                # Editar/visualizar resumo
│   ├── activities/                 # Atividades do evento
│   │   └── index.tsx               # Inscrever-se em atividades
│   ├── evaluations/                # Avaliações de resumos
│   │   ├── index.tsx               # Minhas avaliações (parecerista)
│   │   └── [id].tsx                # Avaliar resumo específico
│   ├── settings/                   # [ADMIN] Configurações do evento
│   │   ├── index.tsx               # Configurações gerais
│   │   ├── edition.tsx             # Configuração de edição
│   │   ├── subscriptions.tsx       # Config. de inscrições
│   │   ├── abstracts.tsx           # Config. de resumos
│   │   ├── reviews.tsx             # Config. de avaliações
│   │   ├── activities.tsx          # Config. de atividades + CRUD
│   │   └── certificates.tsx        # Config. de certificados
│   ├── users/
│   │   └── [id].tsx                # Perfil de usuário (admin)
│   ├── merging/
│   │   ├── index.tsx               # Redirect
│   │   └── [uuid].tsx              # Confirmação merge de contas
│   ├── checkin/
│   │   ├── index.tsx               # Self check-in via QR Code
│   │   └── erro.tsx                # Página de erro de check-in
│   └── examples/                   # Componentes de exemplo (dev)
│
├── components/                     # Componentes React
│   ├── layout/                     # Layouts de página
│   │   ├── main.tsx                # Layout autenticado (header + sidebar + footer)
│   │   ├── clear.tsx               # Layout público (login/registro)
│   │   ├── header.tsx              # Navbar com navegação
│   │   ├── sidebar.tsx             # Sidebar colapsável
│   │   ├── footer.tsx              # Rodapé
│   │   └── user-menu.tsx           # Menu do usuário (avatar dropdown)
│   ├── ui/                         # Componentes UI primitivos
│   │   ├── form/                   # Campos de formulário
│   │   │   ├── formik/             # Componentes Formik (Text, Select, Wysiwyg, etc.)
│   │   │   ├── login-form.tsx      # Formulário de login completo
│   │   │   ├── sign-up-form.tsx    # Modal de cadastro
│   │   │   └── password-recover.tsx # Modal de recuperação de senha
│   │   ├── loading.tsx             # Spinner de carregamento
│   │   ├── loading-button.tsx      # Botão com loading
│   │   ├── tooltip.tsx             # Tooltip Bootstrap
│   │   ├── block-ui.tsx            # Overlay bloqueador de UI
│   │   ├── curtain.tsx             # Animação reveal/hide (framer-motion)
│   │   ├── sweet-alert.tsx         # Wrapper SweetAlert2
│   │   ├── progressbar.tsx         # Barra de progresso animada
│   │   ├── popover.tsx             # Popover Bootstrap
│   │   ├── ionicon.tsx             # Wrapper Ionicons
│   │   ├── lang-selector.tsx       # Seletor de idioma
│   │   └── ...                     # Outros (badge, tooltip, download CSV, etc.)
│   ├── abstract/                   # Componentes de resumos acadêmicos
│   │   ├── abstract-form.tsx       # Formulário de submissão de resumo
│   │   ├── abstract-view.tsx       # Visualização de resumo
│   │   ├── abstract-card.tsx       # Card de resumo em listas
│   │   ├── abstract-status-bar.tsx # Barra de status do pipeline
│   │   ├── evaluation-form.tsx     # Formulário de avaliação
│   │   ├── authors/                # Gerenciamento de autores/coautores
│   │   └── *-modal.tsx             # Modais (avaliadores, status, anexos, etc.)
│   ├── activities/                 # Componentes de atividades
│   │   ├── my-activities.tsx       # Minhas atividades inscritas
│   │   ├── available-activities.tsx # Atividades disponíveis
│   │   ├── admin/                  # Administração de atividades
│   │   ├── checkin/                # Modais de check-in
│   │   └── line/                   # Componentes de linha (speaker, calendar)
│   ├── settings/                   # Componentes de configurações
│   │   ├── settings-layout.tsx     # Layout da página de settings
│   │   ├── activities/             # CRUD de atividades em settings
│   │   ├── taxonomies/             # CRUD de taxonomias (palestrantes, locais, etc.)
│   │   └── fields/                 # Campos customizados
│   ├── registration/               # Passos do registro
│   ├── reports/                    # Dashboard de relatórios
│   │   ├── pieces/                 # Gráficos Recharts (barras, pizza, cards)
│   │   └── *-reports.tsx           # Relatórios por domínio
│   ├── tables/                     # Tabelas de dados (react-table)
│   ├── hooks/                      # Custom hooks React Query
│   ├── hoc/                        # Higher-order components (privateRoute)
│   ├── access-control/             # Sistema de permissões declarativo
│   ├── event/                      # Exibição de edição
│   ├── edition/                    # Cards de edição
│   ├── social-login/               # Botões OAuth (Google, Facebook)
│   ├── order/                      # Exibição de pedidos
│   ├── certificates/               # Certificados
│   ├── document/                   # Documentos
│   ├── side-pane/                  # Painel lateral deslizante
│   ├── notification-panel.tsx      # Painel de notificações
│   ├── notification-modal.tsx      # Modal de envio de mensagens
│   └── my-form.tsx                 # Formulário legado (Redux Form)
│
├── src/                            # Código-fonte compartilhado
│   ├── http/                       # Camada de API / HTTP
│   │   ├── api/
│   │   │   └── wordpress.tsx       # Serviço GraphQL (login, refresh, fetch user)
│   │   ├── axios.tsx               # Instâncias Axios (httpApi, restApi)
│   │   ├── auth-token.tsx          # Gerenciamento de JWT (cookies)
│   │   ├── uppy.tsx                # Upload de arquivos (Uppy + XHR)
│   │   ├── wp-abstract.tsx         # API de resumos
│   │   ├── wp-activity.tsx         # API de atividades
│   │   ├── wp-author.tsx           # API de autores
│   │   ├── wp-certificate.tsx      # API de certificados
│   │   ├── wp-config.tsx           # API de configuração
│   │   ├── wp-document.tsx         # API de documentos
│   │   ├── wp-ecommerce.tsx        # API de produtos (WooCommerce)
│   │   ├── wp-evaluation.tsx       # API de avaliações
│   │   ├── wp-file-api.tsx         # API de arquivos (legado)
│   │   ├── wp-notification.tsx     # API de notificações
│   │   ├── wp-order.tsx            # API de pedidos (GraphQL)
│   │   ├── wp-settings.tsx         # API de configurações
│   │   ├── wp-stats.tsx            # API de estatísticas
│   │   ├── wp-subscription.tsx     # API de inscrições
│   │   ├── wp-taxonomy.tsx         # API de taxonomias
│   │   └── wp-user.tsx             # API de usuários
│   ├── resources/                  # Modelos de domínio / serviços
│   │   ├── event.tsx               # Modelo do evento completo
│   │   ├── edition.tsx             # Modelo de edição com sub-factories
│   │   ├── user.tsx                # Modelo de usuário com roles
│   │   ├── abstract.tsx            # Modelo de resumo acadêmico
│   │   ├── evaluation.tsx          # Modelo de avaliação
│   │   ├── activity.tsx            # Modelo de atividade
│   │   ├── taxonomy.tsx            # Modelo de taxonomia
│   │   ├── order.tsx               # Modelo de pedido
│   │   ├── product.tsx             # Modelo de produto
│   │   ├── notification.tsx        # Tipos de notificação
│   │   ├── responses.tsx           # Helpers de resposta (toast/alert)
│   │   ├── error.tsx               # Wrapper de erros
│   │   ├── objects.tsx             # Utilitários (snakeCase, camelCase)
│   │   └── export-to-excel.tsx     # Exportação HTML → Excel
│   ├── store/                      # Redux store
│   │   ├── _store.tsx              # createStore factory
│   │   ├── _root-reducers.tsx      # combineReducers (user, ui, form)
│   │   ├── user.reducer.tsx        # Reducer de usuário
│   │   ├── user.actions.tsx        # Actions de autenticação
│   │   ├── ui.reducer.tsx          # Reducer de UI (blockui)
│   │   ├── ui.actions.tsx          # Actions de UI
│   │   ├── form.reducer.tsx        # Plugin redux-form (stub)
│   │   └── store.d.tsx             # Types do store
│   ├── types/                      # TypeScript type definitions
│   │   ├── abstracts.d.ts          # Status pipeline, enums
│   │   ├── activity.type.ts        # Schema de atividades
│   │   ├── authors-panel.d.ts      # Schema de autores
│   │   ├── certificates.d.ts       # Tipos de certificado
│   │   ├── document.d.ts           # Schema de documentos
│   │   ├── ecommerce.d.ts          # Produtos, pedidos, categorias
│   │   ├── files.d.ts              # Upload de arquivos
│   │   ├── general.d.ts            # Types genéricos
│   │   ├── restapi.ts              # Response wrapper REST
│   │   ├── review.d.ts             # Critérios de avaliação
│   │   ├── settings.d.ts           # Configurações/edições
│   │   ├── stats.types.ts          # Estatísticas
│   │   ├── taxonomy.type.ts        # Taxonomias (GROUP, SPEAKER, VENUE, ROOM)
│   │   └── users.ts                # Schemas GraphQL de usuário
│   ├── helpers.tsx                 # Funções utilitárias globais
│   ├── i18n.tsx                    # Configuração i18next
│   ├── gtag.tsx                    # Google Analytics
│   └── countries.tsx               # Lista de países
│
├── styles/                         # Estilos globais e modulares
│   ├── global.scss                 # Estilo global (imports Bootstrap)
│   ├── bootstrap/                  # Customizações Bootstrap
│   ├── _variables.scss             # Variáveis SCSS
│   ├── _mixins.scss                # Mixins SCSS
│   └── *.scss                      # Estilos por feature/componente
│
├── public/                         # Assets estáticos
│   ├── img/                        # Imagens
│   ├── locales/                    # Arquivos de tradução (pt, en, es)
│   ├── .htaccess.base              # Config Apache
│   ├── favicon.ico                 # Favicon
│   ├── OneSignalSDKWorker.js       # Service worker OneSignal
│   └── OneSignalSDKUpdaterWorker.js
│
├── __test__/                       # Setup de testes
│   ├── setup-tests.js              # Jest setup
│   ├── cssTransform.js             # CSS mock para Jest
│   └── fileMock.js                 # File mock para Jest
│
├── _bmad/                          # BMAD Method config
├── _bmad-output/                   # BMAD outputs
├── .agents/                        # Agent skills
├── package.json                    # Dependências e scripts
├── tsconfig.json                   # Config TypeScript
├── next.config.js                  # Config Next.js
├── jest.config.js                  # Config Jest
├── .editorconfig                   # Config editor
├── .env                            # Variáveis de ambiente (base)
├── .env.local                      # Variáveis locais
├── .env.test                       # Variáveis de teste
├── .gitignore                      # Git ignore
└── README.md                       # README básico
```

## Diretórios Críticos

| Diretório | Propósito | Prioridade |
|-----------|-----------|------------|
| `pages/` | Rotas e páginas da aplicação | Alta |
| `components/` | Componentes React reutilizáveis | Alta |
| `src/http/` | Camada de comunicação com API | Alta |
| `src/resources/` | Modelos de domínio | Alta |
| `src/store/` | Estado global (Redux) | Média |
| `src/types/` | Definições TypeScript | Média |
| `styles/` | Estilos globais | Baixa |
| `public/locales/` | Traduções i18n | Média |

## Pontos de Entrada

| Arquivo | Descrição |
|---------|-----------|
| `pages/_app.tsx` | Bootstrap da aplicação: Redux Provider, React Query, i18n, Sentry, GA |
| `pages/_document.tsx` | HTML document: scripts externos |
| `pages/index.tsx` | Página inicial → redirect para login |
| `pages/login.tsx` | Autenticação |
| `src/http/axios.tsx` | Instâncias HTTP (httpApi, restApi) |
| `src/store/_store.tsx` | Redux store factory |
