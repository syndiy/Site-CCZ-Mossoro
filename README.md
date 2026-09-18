# Portal CCZ Mossoró

Portal institucional com Next.js exportado como site estático e API Java Spring Boot. O painel operacional está em `/login` e `/admin`, dentro do próprio site.

As instruções de execução e hospedagem estão neste arquivo; o conteúdo editorial oficial fica em `content/`.

## Executar localmente

Requisitos: Node.js 20+, Java 21 para desenvolvimento do backend, ou Docker com Compose recente para o conjunto integrado.

```sh
npm ci
cp .env.deploy.example .env
# Preencha as credenciais e ajuste o caminho do Java atualizado.
docker compose up -d --build
```

O Compose local publica site em localhost:4000 e API em localhost:8080. Se a porta estiver ocupada, ajuste o mapeamento. Para desenvolver somente o frontend, use `npm run dev` e configure `NEXT_PUBLIC_API_URL` com a API disponível. O diretório `admin/` é um editor local legado, não o painel de produção.

## Hospedar em uma VPS

Todos os componentes rodam juntos: Caddy com HTTPS, nginx com site estático, Java, PostgreSQL e MinIO. Configure `.env` com domínio, `CORS_ALLOWED_ORIGINS=https://seu-dominio`, senhas exclusivas e caminho do backend corrigido.

```sh
docker compose -f docker-compose.yml -f docker-compose.vps.yml up -d --build
```

A API fica em `/api` na mesma URL do site. DNS deve apontar para o servidor, com portas 80/443 liberadas. Administrador inicial: `admin@ccz.gov.br`, senha definida em `ADMIN_DEFAULT_PASSWORD`.

Banco e imagens usam volumes persistentes. Não execute `down -v` com dados reais; mantenha backup externo. O Java indicado está em `../_ccz-back-mvp`, derivado de origin/feat/conteudo com as correções da auditoria. Leve essa versão ao servidor.

## Verificar

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Conteúdo novo do painel aparece ao vivo sem rebuild. Notícias e artigos Markdown existentes continuam no build; a rota ao vivo atende publicações novas sem alterar o build estático.
