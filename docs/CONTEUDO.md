# Conteúdo do site: artigos e notícias

O site é **estático** (Next.js `output: export`) e o conteúdo mora em arquivos Markdown
dentro do próprio repositório. Quem escreve usa o **editor** em `admin/`, um app separado.

## Fluxo de publicação

```
Editor (admin/)  →  grava .md em content/  →  commit automático no git
      →  npm run build na raiz  →  pasta out/  →  publica
```

O site e o editor são independentes: se o editor estiver fora do ar, o site continua
funcionando normalmente.

## Onde fica o conteúdo

```
content/
  articles/    → artigos de educação em saúde
  news/        → campanhas, mutirões e avisos
public/img/    → imagens e ilustrações usadas nos textos
```

## Rascunho e publicado

Todo conteúdo tem um estado, controlado pelo campo `draft` no cabeçalho do arquivo:

| Estado | `draft` | O que acontece |
| --- | --- | --- |
| Rascunho | `true` | Só aparece no editor. Não gera página, não entra na listagem nem no sitemap. |
| Publicado | `false` | Aparece no site normalmente. |

No editor, os botões fazem essa troca:

- **Publicar no site**: coloca no ar.
- **Salvar rascunho**: guarda sem publicar.
- **Despublicar**: tira do site sem apagar o conteúdo.
- **Remover**: apaga o arquivo (o histórico do git permite recuperar).

Artigos ainda têm **Destacar na página inicial** (`featured`), que escolhe quais aparecem
na home. Um artigo em rascunho nunca aparece, mesmo destacado.

## Usando o editor

```bash
cd admin
npm install
npm run dev
```

O editor sobe em `http://localhost:4001`. Cada publicação grava o arquivo `.md` e cria um
commit, que é o histórico de quem mudou o quê.

Depois de editar, gere o site atualizado a partir da raiz do projeto:

```bash
npm run build
```

O editor pede senha. Defina a variável `ADMIN_PASSWORD` antes de subir. Em desenvolvimento,
no arquivo `admin/.env.local`; em produção, no ambiente do servidor. Veja `admin/.env.example`.
Sem essa variável, a tela de login avisa que o acesso está desabilitado e ninguém entra.

> A autenticação por senha única é provisória; o login será integrado ao backend Java.

## Criando conteúdo sem o editor

Basta adicionar um `.md` na pasta certa e ele entra na listagem e no sitemap:

```markdown
---
title: "Título do artigo"
description: "Resumo curto para a listagem e o SEO."
eyebrow: "Educação em saúde"
cover: "/img/nome-da-imagem.png"
coverAlt: "Descrição da imagem para acessibilidade"
publishedAt: "2026-07-29"
tags:
  - tema
featured: false
draft: false
---

Primeiro parágrafo de introdução.

## Um subtítulo

Cada `## Subtítulo` vira um item no índice "Neste artigo".

![Legenda da imagem](/img/nome-da-imagem.png)
```

Notícias seguem o mesmo formato em `content/news/`, trocando `description`/`eyebrow` por
`excerpt` e sem o campo `featured`.
