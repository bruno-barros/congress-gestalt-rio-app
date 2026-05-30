# Índice de Documentação do Projeto

> Gerado em: 2026-05-29 | Escaneamento: initial_scan (deep) | Versão: 1.0.0

---

## Visão Geral do Projeto

- **Tipo:** Monólito Web
- **Linguagem Principal:** TypeScript
- **Framework:** Next.js 12 (Pages Router) + React 17
- **Backend:** WordPress REST API + GraphQL
- **Arquitetura:** Client-side em camadas com API remota

---

## Referência Rápida

- **Stack:** Next.js 12 + React 17 + TypeScript + Redux + React Query + Axios + Bootstrap 4 + Sass
- **Entry Point:** `pages/_app.tsx`
- **Padrão Arquitetural:** Componentes em camadas + API services
- **State:** Redux (auth/UI) + React Query (dados de domínio)
- **Autenticação:** JWT via cookies + Google OAuth
- **i18n:** i18next (pt, en, es)
- **Testes:** Jest + React Testing Library

---

## Documentação Gerada

- [Visão Geral do Projeto](./project-overview.md) — Propósito, funcionalidades e classificação
- [Arquitetura](./architecture.md) — Stack tecnológica, padrões arquiteturais, data flow
- [Análise da Árvore de Código-Fonte](./source-tree-analysis.md) — Estrutura de diretórios anotada
- [Contratos de API](./api-contracts.md) — Endpoints REST, GraphQL e admin-ajax
- [Modelos de Dados](./data-models.md) — Schemas TypeScript, modelos de domínio, state
- [Inventário de Componentes](./component-inventory.md) — ~130 componentes categorizados
- [Guia de Desenvolvimento](./development-guide.md) — Setup, comandos, padrões e convenções

---

## Documentação Existente

- [README.md](../README.md) — README básico do Next.js

---

## Início Rápido

```bash
# Instalar
npm install

# Configurar
cp .env .env.local
# Editar .env.local com API_BASEURL e chaves OAuth

# Desenvolver
npm run dev

# Testar
npm test

# Build
npm run build
```

---

## Para Desenvolvimento com IA

Este índice é o ponto de entrada principal para contexto de IA. Ao planejar novas features:

1. **Para features de UI:** Referência `architecture.md` → seção "Estrutura de Componentes"
2. **Para features de API:** Referência `api-contracts.md` → endpoints existentes
3. **Para features full-stack:** Referência `architecture.md` + `api-contracts.md`
4. **Para PRD brownfield:** Aponte o workflow de PRD para este `index.md`
