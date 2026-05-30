# Contratos de API

> Gerado em: 2026-05-29 | Modo: initial_scan | Nível: deep

## Visão Geral

O backend é uma aplicação WordPress com WPGraphQL e REST API customizada. A comunicação é feita por três canais:

| Canal | Base URL | Instância Axios | Uso |
|-------|----------|-----------------|-----|
| **WP REST API** | `{API_BASEURL}/wp-json/event/v1/` | `restApi` | CRUD moderno |
| **WP GraphQL** | `{API_BASEURL}/cms/index.php?graphql` | `httpApi` | Queries complexas, login |
| **WP admin-ajax** | `{API_BASEURL}/wp-admin/admin-ajax.php?action=...` | `httpApi` | Uploads, operações legado |

## Autenticação

- **Tipo:** JWT Bearer Token
- **Armazenamento:** Cookies (`gestalt.authToken`, `gestalt.refreshToken`)
- **Header:** `Authorization: Bearer <token>`
- **Interceptador:** Anexado automaticamente em `httpApi` e `restApi`

---

## REST API (`/wp-json/event/v1/`)

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/signup_with_email` | Registro por email |
| POST | `/auth/social_login` | Login social (Google/Facebook) |
| POST | `/auth/merge_profiles` | Merge de perfil social com existente |
| POST | `/auth/merge_approved` | Confirmar merge (UUID) |
| POST | `/auth/remember_password` | Reset de senha por email |
| POST | `/auth/account_recover` | Recuperação de conta |

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| PUT | `/users/{id}` | Atualizar perfil |
| POST | `/users/{id}/password_update` | Alterar senha |
| POST | `/users/{id}/consents` | Atualizar consentimentos |
| POST | `/users/{id}/remote_session` | Salvar sessão remota |
| GET | `/users/{id}/activities?edition=` | Atividades do usuário |
| GET | `/users/{id}/certificates?edition=` | Certificados do usuário |
| POST | `/users/switch` | Admin: trocar de usuário |
| POST | `/notifications/send` | Enviar notificação |

### Resumos (Abstracts)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/abstracts` | Criar/atualizar resumo |
| POST | `/abstracts/find_by_criteria` | Buscar por critérios |
| PUT | `/abstracts/status` | Atualizar status em lote |
| POST | `/abstracts/export` | Exportar resumos |
| DELETE | `/abstracts?ids=` | Deletar em lote |
| POST | `/abstracts/set_evaluator` | Atribuir avaliador(es) |
| POST | `/abstracts/evaluations_visibility` | Visibilidade em lote |

### Autores

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/authors/` | Criar/atualizar autor |
| PUT | `/authors/{id}` | Atualizar autor |
| DELETE | `/authors/{id}` | Deletar autor |
| GET | `/authors/search?email=&abstract_id=` | Buscar autor |

### Avaliações (Evaluations)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| PUT | `/evaluations/{id}` | Atualizar avaliação |
| PUT | `/evaluations/{id}/visibility` | Toggle visibilidade |
| DELETE | `/evaluations/{id}` | Deletar avaliação(ões) |

### Atividades

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/activities/{id}` | Buscar atividade |
| GET | `/activities/?edition=&active=&user_id=` | Listar atividades |
| POST | `/activities/` | Criar atividade |
| PUT | `/activities/{id}` | Atualizar atividade |
| DELETE | `/activities/{id}` | Deletar atividade |
| POST | `/activities/{id}/subscribe` | Inscrever usuário |
| POST | `/activities/{id}/subscribe_all` | Inscrever todos |
| POST | `/activities/{id}/unsubscribe` | Desinscrever usuário |
| GET | `/activities/{id}/checkin` | Status de check-in |
| POST | `/activities/{id}/checkin` | Realizar check-in |
| POST | `/activities/subscription/{id}/checkin` | Admin check-in |
| DELETE | `/activities/subscription/{id}/checkin` | Desfazer check-in |
| GET | `/activities/subscription/labels` | Exportar etiquetas |

### Taxonomias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/taxonomies/{id}` | Buscar taxonomia |
| GET | `/taxonomies/?edition=&type=` | Listar taxonomias |
| POST | `/taxonomies/` | Criar taxonomia |
| PUT | `/taxonomies/{id}` | Atualizar taxonomia |
| DELETE | `/taxonomies/{id}` | Deletar taxonomia |

### Configurações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/settings?edition=` | Buscar configurações |
| POST | `/settings` | Salvar configurações |
| GET | `/editions` | Listar edições |

### Estatísticas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/stats?edition=` | Buscar estatísticas |
| POST | `/stats?edition=` | Atualizar cache |

### Certificados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/certificates?edition=` | Listar modelos |
| GET | `/certificates/preview?edition=&type=&user_id=` | Preview URL |
| POST | `/certificates/generate` | Gerar certificado |

### Documentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/documents/{userId}` | Documentos do usuário |
| DELETE | `/documents/{id}` | Deletar documento |

### Upload

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/upload` | Upload de arquivo (v1) |

### Notificações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/notifications/read` | Marcar como lida |

### Inscrições

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/subscription/affirmative_action` | Registro ação afirmativa |

---

## GraphQL (`/cms/index.php?graphql`)

Todas via POST com corpo `{ query: "...", variables: {...} }`. O parâmetro URL `&tag` é usado para diferenciação de cache.

| Tag | Operação | Descrição |
|-----|----------|-----------|
| `login` | `mutation LoginUser` | Autenticação com email/senha |
| `refreshJwtAuthToken` | `mutation RefreshToken` | Renovar token JWT |
| `user` | `query FetchUser` | Buscar usuário por ID |
| `fetchLogged` | `query fetchLogged` | Usuário logado (viewer) |
| `searchUser` | `query searchUser` | Buscar usuários (evUserSearch) |
| `all` | `query all` | Listar usuários com roles |
| `abstract` | `query find` | Resumo completo |
| `abstractFilters` | `query collection` | Lista filtrada de resumos |
| `authors` | `query find` | Autores de resumo |
| `attachments` | `query find` | Anexos de resumo |
| `evaluations` | `query WpEvaluation` | Lista de avaliações |
| `evEvaluation` | `query WpEvaluation` | Avaliação individual |
| `countInReview` | `query countInReview` | Contagem pendente |
| `byAbstract` | `query byAbstract` | Avaliações de um resumo |
| `orders` | `query byUser` | Pedidos por usuário |
| `subscriptions` | `query subscriptions` | Pedidos + gateways |
| `productCategories` | `query productCategories` | Categorias de produto |
| `products` | `query products` | Produtos por categoria |
| `notifications` | `query WpNotification` | Notificações paginadas |
| `zbDocuments` | `query fetchDocuments` | Documentos paginados |
| `pushNotificationApp` | `query pushNotificationApp` | Info OneSignal |

---

## admin-ajax.php (`/wp-admin/admin-ajax.php?action=...`)

Todas via POST.

| Action | Descrição |
|--------|-----------|
| `ev_logout` | Logout |
| `ev_update_avatar` | Atualizar avatar |
| `ev_add_credits` | Adicionar créditos |
| `ev_users_export` | Exportar usuários |
| `ev_avatar_upload` | Upload de avatar (Uppy) |
| `ev_document_upload` | Upload de documento (Uppy) |
| `ev_set_speaker` | Definir palestrante |
| `ev_author_delete` | Deletar autor (legado) |
| `ev_abstract_anais` | Gerar anais |
| `ev_abstract_consents` | Consentimentos de resumo |
| `ev_evaluation_save` | Salvar avaliação (legado) |
| `document_update` | Atualizar metadados de documento |
| `ev_push_notification_send` | Enviar push notification |

---

## Response Wrapper

```typescript
interface WpRestResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
```

## Classes de Serviço

| Classe | Arquivo | Responsabilidade |
|--------|---------|------------------|
| `Wordpress` | `src/http/api/wordpress.tsx` | Login GraphQL |
| `WpUser` | `src/http/wp-user.tsx` | CRUD de usuários |
| `WpAbstract` | `src/http/wp-abstract.tsx` | CRUD de resumos |
| `WpAuthor` | `src/http/wp-author.tsx` | CRUD de autores |
| `WpEvaluation` | `src/http/wp-evaluation.tsx` | CRUD de avaliações |
| `WpActivity` | `src/http/wp-activity.tsx` | CRUD de atividades |
| `WpTaxonomy` | `src/http/wp-taxonomy.tsx` | CRUD de taxonomias |
| `WpSettings` | `src/http/wp-settings.tsx` | Configurações |
| `WpStats` | `src/http/wp-stats.tsx` | Estatísticas |
| `WpCertificate` | `src/http/wp-certificate.tsx` | Certificados |
| `WpDocument` | `src/http/wp-document.tsx` | Documentos |
| `WpOrder` | `src/http/wp-order.tsx` | Pedidos (GraphQL) |
| `WpEcommerce` | `src/http/wp-ecommerce.tsx` | Produtos (GraphQL) |
| `WpNotification` | `src/http/wp-notification.tsx` | Notificações |
| `WpConfig` | `src/http/wp-config.tsx` | Config + Push |
| `WpFileApi` | `src/http/wp-file-api.tsx` | Arquivos legado |
| `WpSubscription` | `src/http/wp-subscription.tsx` | Inscrições |
