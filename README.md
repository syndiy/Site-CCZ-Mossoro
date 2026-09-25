# Portal CCZ Mossoró

Frontend Next.js exportado como arquivos estáticos. O único backend é a API Java Spring Boot: autenticação, permissões, denúncias, equipe, conteúdo e uploads são responsabilidade dela. O painel está em `/login/` e `/admin/`.

## Desenvolvimento

Requisitos: Node.js 20.19+ (ou 22.12+), Java 21 para executar o Spring, ou Docker com Compose recente.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

O frontend abre em `http://localhost:3000`. Inicie o Spring com `CORS_ALLOWED_ORIGINS=http://localhost:3000` e configure `NEXT_PUBLIC_API_URL=http://localhost:8080` no `.env.local`. Essa variável é incorporada no build; alterá-la exige gerar o frontend novamente.

## Backend compatível

A implementação localizada em `../_ccz-back-mvp` contém a linha de conteúdo (`feat/conteudo`) e correções de integração, a partir do commit `3152dcb`. Ela oferece `/users/me`, `/conteudo`, `/midia`, `/denuncia`, `/allowedEmployee` e `/configuracaoGlobal`. A pasta vizinha `SiteInstitucionalCCZ-BackEnd` está em uma versão anterior, sem os endpoints de conteúdo; não é intercambiável com esta API.

Defina `CCZ_BACKEND_PATH` explicitamente com o checkout Spring compatível. O editor Node legado foi removido: não há servidor Next em produção, endpoints Next, assinatura de JWT, gravação de conteúdo ou commits Git pelo frontend. Restos locais ignorados em `admin/` não fazem parte da aplicação nem da imagem Docker.

## Executar o conjunto local

```sh
cp .env.deploy.example .env
# Preencha senhas exclusivas e confira CCZ_BACKEND_PATH.
docker compose up -d --build
```

Site: `http://localhost:4000`. API para diagnóstico local: `http://localhost:8080`. O navegador usa `/api`, encaminhado pelo nginx ao Spring. Banco e armazenamento não expõem portas públicas. `npm run preview` também constrói o frontend e inicia suas dependências pelo Compose, usando esse mesmo `.env`.

## Produção em VPS

Configure `.env` com `SITE_DOMAIN`, `CCZ_BACKEND_PATH` e credenciais exclusivas. `CORS_ALLOWED_ORIGINS` pode ficar vazio para derivar `https://SITE_DOMAIN` na configuração VPS.

```sh
docker compose -f docker-compose.yml -f docker-compose.vps.yml config --quiet
docker compose -f docker-compose.yml -f docker-compose.vps.yml up -d --build
```

Caddy fornece HTTPS; nginx entrega `out/` e encaminha `/api/` ao Spring. Na VPS, somente Caddy publica portas (80/443). DNS deve apontar para o servidor. O administrador inicial é `admin@ccz.gov.br`, com a senha definida em `ADMIN_DEFAULT_PASSWORD`. O segredo JWT permanece exclusivamente no ambiente do backend.

PostgreSQL e MinIO usam volumes persistentes. Mantenha backups externos e teste a restauração; `down -v` apaga esses dados. O backend ainda usa Hibernate `ddl-auto=update`: mudanças de esquema exigem revisão e backup antes da atualização; não há migrações versionadas neste frontend.

## Verificar

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
```

O resultado de produção está em `out/`; `next start` não atende uma exportação estática. Valide login, perfis de editor/administrador, publicação, upload e atualização de ocorrência com a API e o armazenamento reais antes de liberar a implantação.

Publicações novas aparecem pela API sem rebuild. Markdown em `content/` continua sendo material estático do build, lido apenas durante a geração. Consulte [o fluxo de conteúdo](docs/CONTEUDO.md).
