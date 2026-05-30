# Modelos de Dados

> Gerado em: 2026-05-29 | Modo: initial_scan | Nível: deep

## Visão Geral

O projeto utiliza TypeScript para tipagem e classes de domínio em `src/resources/` para lógica de negócio. Os dados vêm de duas fontes: WordPress REST API e WPGraphQL.

---

## Modelos de Domínio (`src/resources/`)

### Event (`event.tsx`)

Modelo principal do evento. Contém configurações globais e da edição atual.

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `global` | Object | Nome, URLs, emails, edições, notificações, certificados |
| `edition` | Edition | Dados da edição atual |
| `abstract` | Object | Config de resumos (habilitado, status model, limites, tópicos, modalidades) |
| `subscription` | Object | Config de inscrições (habilitado, datas, categoria, planos) |
| `review` | Object | Config de avaliações (avaliadores, dias, perguntas) |

Métodos: `getEditions()`, `currentEdition()`, `buildUrlCheckout()`, `getLanguages()`, `Event.make(data)`

### Edition (`edition.tsx`)

Configuração específica de cada edição do evento com sub-factories:

| Sub-modelo | Métodos principais |
|------------|-------------------|
| `Edition` | `isOpenToSubscribe()`, `isOpenToAbstracts()`, gestão de consentimentos |
| `Edition_Subscription` | `isAllowed()`, `getCategoryId()`, `getPlansDescription()` |
| `Edition_Abstract` | `getTopics()`, `getModalities()`, `getField(key)`, `getRulesUrl()` |
| `Edition_Review` | `getDaysToEvaluate()`, `getCriterias()`, `getQuestions()` |
| `Edition_Activity` | `isOpenToApply(user?)`, `isCancelationAllowed()`, `isCheckinAllowed()` |
| `Edition_Certificate` | `isAllowed(type)` |

### User (`user.tsx`)

Modelo de usuário com verificação de roles WordPress.

| Interface | Campos principais |
|-----------|------------------|
| `UserInterface` | 50+ campos: ID, name, email, avatar, roles, locale, cpf, phone, etc. |

| Método | Descrição |
|--------|-----------|
| `isAdmin()` | Role `administrator` |
| `isEvaluator()` | Role `contributor` |
| `isParticipant()` | Role `subscriber` |
| `isSupervisor()` | Role `suporte` |
| `isSuperAdmin()` | Admin + ID em `super_users_ids` |
| `isShopManager()` | Role `shop_manager` |
| `isSupport()` | Role `suporte` |
| `canManageAbstracts()` | admin/editor/superAdmin/shopManager |
| `canEvaluateAbstracts()` | contributor |

**Author**: Coautor de resumo (name, email, company, bio, is_speaker, order)

### Abstract (`abstract.tsx`)

Resumo/trabalho acadêmico.

| Método | Descrição |
|--------|-----------|
| `statusColorName()` | Mapeia status para cor Bootstrap |
| `isLockedToEdition()` | True para 8 status (revision, evaluating, rejected, approved...) |
| `isAbleToEdit()` | Baseado em status e modelo de status da edição |
| `isAbleToAttach()` | Depende do status model (sinopse vs abstract) |
| `hasConsents()`, `getConsents()`, `hasConsentsAgreement()` | Gestão de consentimentos |

**Status Pipeline:**
- **Modelo Abstract** (7 status): pending → revision → evaluating → rejected/waiting_update → pre_approved → approved
- **Modelo Sinopse+Abstract** (12 status): pending → synopsis_revision → synopsis_evaluating → synopsis_rejected/synopsis_waiting_upd → synopsis_approved → final_revision → evaluating → rejected/waiting_update → pre_approved → approved

### Evaluation (`evaluation.tsx`)

Avaliação de resumo por parecerista.

| Método | Descrição |
|--------|-----------|
| `getAverage()` | Média de 7 critérios (relevance, quality, clarity, contributions, bibliography, research, methodology) |
| `isEditable()` | Status `synopsis_evaluating` ou `evaluating` |
| `getAnswers()` | Parse JSON de respostas |
| `getAbstract()` | Retorna modelo Abstract |

### Activity (`activity.tsx`)

Atividade do evento com suporte multilíngue: `getTitle(lang)`, `getDescription(lang)`

### Taxonomy (`taxonomy.tsx`)

Taxonomias do evento com 4 tipos:

| Tipo | Constante | Descrição |
|------|-----------|-----------|
| GROUP | `TaxonomyType.GROUP` | Grupo de atividade |
| SPEAKER | `TaxonomyType.SPEAKER` | Palestrante |
| VENUE | `TaxonomyType.VENUE` | Local |
| ROOM | `TaxonomyType.ROOM` | Sala |

### Order (`order.tsx`)

| Classe | Descrição |
|--------|-----------|
| `Order` | Pedido com `isCompleted()`, `getCustomerName()`, `getMeta(key)`, `getItems()` |
| `OrderCollection` | Coleção com `getCompleted()`, `hasValidSubscription(edition)` |

Status: CANCELLED, COMPLETED, FAILED, ON_HOLD, PENDING, PROCESSING, REFUNDED

### Product (`product.tsx`)

Produto WooCommerce: `getFullPrice()`, `getSalePrice()`, `getShortDescription()`

---

## Schemas TypeScript (`src/types/`)

### ActivitySchema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `number` | ID da atividade |
| `uuid` | `string` | UUID para check-in |
| `edition` | `string` | ID da edição |
| `title_pt/es/en` | `string` | Título multilíngue |
| `description_pt/es/en` | `string` | Descrição multilíngue |
| `start_at`, `end_at` | `string` | Data/hora início/fim |
| `workload` | `number` | Carga horária |
| `vacancies` | `number` | Vagas totais |
| `occupation` | `number` | Ocupação atual |
| `certificate` | `boolean` | Gera certificado |
| `group`, `venue`, `room`, `speakers` | `TaxonomySchema` | Relações |
| `subscriptions`, `valid_subscriptions` | `ActivityUserSchema[]` | Inscrições |

### EvaluationSchema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `number` | ID da avaliação |
| `abstract_id` | `number` | Resumo avaliado |
| `user_id` | `number` | Avaliador |
| `relevance`, `quality`, `clarity` | `number` | Notas (0-5) |
| `contributions`, `bibliography` | `number` | Notas (0-5) |
| `methodology`, `research` | `number` | Notas (0-5) |
| `comment`, `private_comment` | `string` | Comentários |
| `answers` | `object` | Respostas JSON |
| `is_public` | `number` | Visibilidade |

### DocumentSchema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `number` | ID do documento |
| `owner_id` | `number \| null` | Dono |
| `user_id` | `number` | Usuário |
| `abstract_id` | `number \| null` | Resumo associado |
| `name`, `url`, `mimetype` | `string` | Arquivo |
| `size` | `number` | Tamanho em bytes |
| `context` | `string` | Contexto (ex: `affirmative_action`) |

### TaxonomySchema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `number` | ID |
| `edition` | `string` | Edição |
| `type` | `TaxonomyType` | GROUP/SPEAKER/VENUE/ROOM |
| `label_pt/es/en` | `string` | Nome multilíngue |
| `description_pt/es/en` | `string` | Descrição multilíngue |
| `active` | `boolean` | Ativo |
| `speaker` | `UserInterface` | (apenas SPEAKER) |

### CertificatesSchema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `type` | `CertificateType` | PARTICIPANT/ABSTRACT/ACTIVITY/SPEAKER |
| `name` | `string` | Nome |
| `edition` | `string` | Edição |
| `url` | `string \| null` | URL do PDF |

---

## Gerenciamento de Estado

### Redux Store

```
RootState
├── user: any              # Dados do usuário logado (13 campos filtrados)
│   ├── ID, id
│   ├── user_login, user_email
│   ├── display_name, first_name, last_name
│   ├── locale, avatar
│   ├── _profile_completed, _revalidate_password
│   ├── google_social_id, facebook_social_id
│   └── cart?: any
├── ui: UiState
│   └── blockui: boolean   # Overlay de carregamento
└── form: any              # Estado do redux-form
```

### React Query Cache

Os dados de domínio são gerenciados via React Query com hooks customizados:

| Hook | Query Key | Dados |
|------|-----------|-------|
| `useSettings()` | `["settings", null]` | Configurações do evento |
| `useCurrentUser()` | `["current-user"]` | Usuário logado |
| `useAbstracts()` | `["abstracts", editionId]` | Lista de resumos |
| `useAbstract(id)` | `["abstract", id]` | Resumo individual |
| `useActivities()` | `["activities", editionId]` | Lista de atividades |
| `useEvaluations()` | `["evaluations", editionId, userId]` | Avaliações |
| `useUserOrders()` | `["orders", userId]` | Pedidos do usuário |
| `useAllUsers()` | `["all-users"]` | Todos os usuários |
| `useSubscriptions()` | `["subscriptions", editionId]` | Inscrições |
| `useCertificates()` | `["certificates", editionId]` | Certificados |
| `useEditions()` | `["editions"]` | Edições disponíveis |
