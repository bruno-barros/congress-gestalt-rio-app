# Inventário de Componentes

> Gerado em: 2026-05-29 | Modo: initial_scan | Nível: deep

## Resumo

~130 componentes em 20 diretórios, organizados em categorias funcionais.

---

## Layout (7 componentes)

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| MainLayout | `layout/main.tsx` | Layout autenticado com header, sidebar, footer, block UI |
| ClearLayout | `layout/clear.tsx` | Layout público para login/registro |
| Header | `layout/header.tsx` | Navbar com navegação, menu admin, notificações |
| Sidebar | `layout/sidebar.tsx` | Painel lateral colapsável |
| UserMenu | `layout/user-menu.tsx` | Dropdown do avatar do usuário |
| Footer | `layout/footer.tsx` | Rodapé com versão |
| EditionSidebar | `event/edition-sidebar.tsx` | Sidebar com info da edição |

## UI Primitives (20+ componentes)

| Componente | Arquivo | Categoria | Reutilizável |
|------------|---------|-----------|-------------|
| Loading | `ui/loading.tsx` | Display | Sim |
| LoadingButton | `ui/loading-button.tsx` | Form | Sim |
| ToolTip | `ui/tooltip.tsx` | Display | Sim |
| Sweet | `ui/sweet-alert.tsx` | Display | Sim |
| ProgressBar | `ui/progressbar.tsx` | Display | Sim |
| PopOver | `ui/popover.tsx` | Display | Sim |
| Curtain | `ui/curtain.tsx` | Display | Sim |
| CurtainDelayed | `ui/curtain-delayed.tsx` | Display | Sim |
| BlockUi | `ui/block-ui.tsx` | Utility | Sim |
| Icon | `ui/ionicon.tsx` | Display | Sim |
| LangSelector | `ui/lang-selector.tsx` | Navigation | Sim |
| Hr | `ui/hr.tsx` | Display | Sim |
| DownloadCsv | `ui/download-csv.tsx` | Utility | Sim |
| ButtonDeleteConfirmation | `ui/button-delete-confirmation.tsx` | Form | Sim |
| BadgeSubscribed | `ui/badge-subscribed.tsx` | Display | Sim |
| MaybeLoginWithEmail | `ui/maybe-login-with-email.tsx` | Modal | Sim |
| MergingUsers | `ui/merging-users.tsx` | Modal | Sim |
| AcoesAfirmativasBanner | `ui/acoes-afirmativas-banner.tsx` | Display | Não |

## Campos Formik (15+ componentes)

| Componente | Arquivo | Propósito |
|------------|---------|-----------|
| Text | `ui/form/formik/text.tsx` | Input de texto com float-label |
| Password | `ui/form/formik/password.tsx` | Senha com medidor de força |
| Select | `ui/form/formik/select.tsx` | Dropdown com multi-select |
| Textarea | `ui/form/formik/textarea.tsx` | Área de texto |
| Wysiwyg | `ui/form/formik/wysiwyg.tsx` | Editor rich text (ReactQuill) |
| Switch | `ui/form/formik/switch.tsx` | Toggle switch |
| Checkboxes | `ui/form/formik/checkboxes.tsx` | Grupo de checkboxes |
| Attachments | `ui/form/formik/attachments.tsx` | Upload de arquivos (Uppy) |
| Image | `ui/form/formik/image.tsx` | Upload de imagem |
| Authors | `ui/form/formik/authors.tsx` | Gerenciamento de coautores |
| Tags | `ui/form/formik/tags.tsx` | Input de tags |
| DatePicker | `ui/form/formik/date-picker.tsx` | Seletor de data |
| DateRange | `ui/form/formik/date-range.tsx` | Range de datas |
| Phone | `ui/form/formik/phone.tsx` | Telefone com máscara |
| Mask | `ui/form/formik/mask.tsx` | Input com máscara (CPF, phone, etc.) |

## Abstract (24 componentes)

| Componente | Arquivo | Categoria |
|------------|---------|-----------|
| AbstractForm | `abstract/abstract-form.tsx` | Form |
| AbstractView | `abstract/abstract-view.tsx` | Display |
| AbstractCard | `abstract/abstract-card.tsx` | Display |
| AbstractStatusBar | `abstract/abstract-status-bar.tsx` | Display |
| AbstractRating | `abstract/abstract-rating.tsx` | Form |
| AbstractComments | `abstract/abstract-comments.tsx` | Display |
| AbstractConsentTerms | `abstract/abstract-consent-terms.tsx` | Modal |
| AbstractAnswers | `abstract/abstract-answers.tsx` | Display |
| AbstractAuthorLine | `abstract/abstract-author-line.tsx` | Display |
| NextStepTip | `abstract/next-step-tip.tsx` | Display |
| AbstractsRules | `abstract/abstracts-rules.tsx` | Display |
| EvaluationForm | `abstract/evaluation-form.tsx` | Form |
| SetStatusModal | `abstract/set-status-modal.tsx` | Modal |
| SetStatusByCriteriaModal | `abstract/set-status-by-criteria-modal.tsx` | Modal |
| SetEvaluatorsModal | `abstract/set-evaluators-modal.tsx` | Modal |
| SetEvaluationVisibilityModal | `abstract/set-evaluation-visibility-modal.tsx` | Modal |
| EvaluatorOrientationModal | `abstract/evaluator-orientation-modal.tsx` | Modal |
| EvaluationDetailsModal | `abstract/evaluation-details-modal.tsx` | Modal |
| AbstractEvaluationsModal | `abstract/abstract-evaluations-modal.tsx` | Modal |
| AbstractAuthorsModal | `abstract/abstract-authors-modal.tsx` | Modal |
| AbstractAttachmentsModal | `abstract/abstract-attachments-modal.tsx` | Modal |
| AuthorEditModal | `abstract/author-edit-modal.tsx` | Modal |
| AuthorsPanel | `abstract/authors/authors-panel.tsx` | Display |
| SearchAuthor | `abstract/authors/search-author.tsx` | Form |

## Activities (10+ componentes)

| Componente | Arquivo | Categoria |
|------------|---------|-----------|
| MyActivities | `activities/my-activities.tsx` | Display |
| AvailableActivities | `activities/available-activities.tsx` | Display |
| AvailableActivityLine | `activities/available-activity-line.tsx` | Display |
| ActivitiesFilters | `activities/activities-filters.tsx` | Form |
| CancelSubscriptionModal | `activities/cancel-subscription-modal.tsx` | Modal |
| ActivitiesPage | `activities/admin/activities-page.tsx` | Display |
| SubscriptionPanel | `activities/admin/subscription-panel.tsx` | Display |
| DoCheckinModal | `activities/checkin/do-checkin-modal.tsx` | Modal |
| CancelCheckinModal | `activities/checkin/cancel-checkin-modal.tsx` | Modal |
| Speaker | `activities/line/speaker.tsx` | Display |
| ActivityAddCalendar | `activities/line/activity-add-calendar.tsx` | Display |

## Settings (11+ componentes)

| Componente | Arquivo | Categoria |
|------------|---------|-----------|
| SettingsLayout | `settings/settings-layout.tsx` | Layout |
| SettingsHelpers | `settings/settings-helpers.tsx` | Utility |
| Topics | `settings/fields/topics.tsx` | Form |
| ListActivities | `settings/activities/list-activities.tsx` | Display |
| ActivityForm | `settings/activities/activity-form.tsx` | Form |
| ListTaxonomies | `settings/taxonomies/list-taxonomies.tsx` | Display |
| TaxonomyForm | `settings/taxonomies/taxonomy-form.tsx` | Form |

## Reports (7+ componentes)

| Componente | Arquivo | Propósito |
|------------|---------|-----------|
| SubscriptionsReports | `reports/subscriptions-reports.tsx` | Stats de inscrições |
| AbstractsReports | `reports/abstracts-reports.tsx` | Stats de resumos |
| GlobalUsers | `reports/global-users.tsx` | Stats de usuários |
| BarPercentual | `reports/pieces/bar-percentual.tsx` | Gráfico de barras (Recharts) |
| CardNumber | `reports/pieces/card-number.tsx` | Card com número grande |

## Hooks (31 hooks)

### Dados

| Hook | Query Key | Dados |
|------|-----------|-------|
| useSettings | `["settings", null]` | Config do evento |
| useCurrentUser | `["current-user"]` | Usuário logado |
| useAbstracts | `["abstracts", editionId]` | Lista de resumos |
| useAbstract | `["abstract", id]` | Resumo individual |
| useActivities | `["activities", editionId]` | Lista de atividades |
| useActivity | `["activity", id]` | Atividade individual |
| useEvaluations | `["evaluations", editionId, userId]` | Avaliações |
| useEvaluation | `["evaluation", id]` | Avaliação individual |
| useAllUsers | `["all-users"]` | Todos usuários |
| useUser | `["user", id]` | Usuário individual |
| useUserOrders | `["orders", userId]` | Pedidos do usuário |
| useSubscriptions | `["subscriptions", editionId]` | Inscrições |
| useCertificates | `["certificates", editionId]` | Certificados |
| useEditions | `["editions"]` | Edições |
| useStats | `["stats", editionId]` | Estatísticas |
| useProductCategories | `["product-categories"]` | Categorias |
| useProducts | `["products"]` | Produtos |

### UI

| Hook | Propósito |
|------|-----------|
| useTrans | Tradução i18n |
| useDebounce | Debounce de valor |
| useLocalStorage | Estado persistido |
| useSessionCountdown | Monitor de sessão |
| usePushNotification | OneSignal |
| useBuscaCEP | Busca de CEP |
| useUppy | Upload de arquivos |
| useConsent | Consentimentos |
| useEffectAsync | Effect async |
| useSwitchUser | Troca de usuário (admin) |

## Access Control (7 componentes)

| Componente | Arquivo | Propósito |
|------------|---------|-----------|
| Ac | `access-control/index.tsx` | Wrapper declarativo de permissão |
| Resolver | `access-control/resolver.tsx` | Core resolver AND/OR |
| REQUIREMENTS | `access-control/requirements.tsx` | Registry de permissões |
| AbstractResolver | `access-control/resolvers/Abstract.tsx` | Permissões de resumo |
| UserResolver | `access-control/resolvers/User.tsx` | Permissões de usuário |
| EvaluationResolver | `access-control/resolvers/Evaluation.tsx` | Permissões de avaliação |
| ActivityResolver | `access-control/resolvers/Activity.tsx` | Permissões de atividade |

## Tabelas (3 componentes)

| Componente | Biblioteca | Colunas |
|------------|-----------|---------|
| SubscribersTable | react-table | ID, Nome, Email, Data Inscrição, Check-in, Ações |
| CertificatesTable | react-table | ID, Data, Tipo, Nome, Certificado |
| ActivitiesTable | react-table | ID, Data, Hora, Título, Ocupação, CheckIn |

## Outros

| Componente | Arquivo | Propósito |
|------------|---------|-----------|
| LoginForm | `ui/form/login-form.tsx` | Login completo com OAuth |
| SignUp | `ui/form/sign-up-form.tsx` | Modal de cadastro |
| PasswordRecover | `ui/form/password-recover.tsx` | Recuperação de senha |
| AccountRecover | `ui/form/account-recover.tsx` | Recuperação de conta |
| NotificationPanel | `notification-panel.tsx` | Painel de notificações |
| NotificationModal | `notification-modal.tsx` | Envio de mensagens |
| CustomSidePane | `side-pane/side-pane.tsx` | Painel lateral deslizante |
| privateRoute | `hoc/private-route.tsx` | HOC de autenticação |
| EditionCard | `edition/edition-card.tsx` | Card de edição |
| OrderLine | `order/order-line.tsx` | Exibição de pedido |
| CertificatePreviewModal | `certificates/certificate-preview-modal.tsx` | Preview de certificado |
| CertificateLine | `certificates/certificate-line.tsx` | Card de certificado |
| DeleteButton | `document/delete-button.tsx` | Delete de documento |
