# Visão Geral do Projeto

> Gerado em: 2026-05-29 | Modo: initial_scan | Nível: deep

## Nome do Projeto

**conceito-evento** — Congresso Gestalt RJ — Aplicação de Evento

## Propósito

Sistema web para gestão de eventos acadêmicos (congressos, seminários). Gerencia edições de eventos, inscrições de participantes, submissão e avaliação de trabalhos acadêmicos (resumos), programação de atividades, check-in e emissão de certificados.

## Funcionalidades Principais

| Funcionalidade | Descrição |
|---------------|-----------|
| **Multi-edição** | Suporte a múltiplas edições do evento com configurações independentes |
| **Inscrições** | Registro de participantes com wizard multi-step, planos de pagamento, integração WooCommerce |
| **Resumos** | Submissão de trabalhos acadêmicos com pipeline de status (sinopse → resumo final) |
| **Avaliação** | Sistema de avaliação por pares com 7 critérios, notas 0-5, comentários público/privado |
| **Atividades** | Programação de atividades com inscrição, vagas, check-in via QR Code |
| **Certificados** | Geração de certificados (participante, palestrante, atividade, resumo) |
| **Relatórios** | Dashboard com estatísticas de inscrições, resumos e participantes |
| **Notificações** | Notificações in-app e push (OneSignal) |
| **i18n** | Suporte multilíngue (pt, en, es) |
| **Login Social** | Google OAuth + Facebook com merge de contas |
| **Ações Afirmativas** | Programa de inclusão com upload de documentos |

## Classificação

| Aspecto | Valor |
|---------|-------|
| **Tipo de repositório** | Monólito |
| **Tipo de projeto** | Web (SPA com SSR) |
| **Arquitetura** | Client-side em camadas, API remota WordPress |
| **Linguagem primária** | TypeScript |
| **Framework principal** | Next.js 12 (Pages Router) |
| **Backend** | WordPress + WPGraphQL + REST API customizada |

## Stack Resumida

| Categoria | Tecnologia |
|-----------|-----------|
| Framework | Next.js 12 + React 17 |
| Linguagem | TypeScript 4.9 |
| State | Redux + React Query |
| HTTP | Axios |
| UI | Bootstrap 4 + React-Bootstrap + Sass |
| Forms | Formik + Yup |
| Auth | JWT (cookies) + Google OAuth |
| Backend | WordPress REST API + GraphQL |
