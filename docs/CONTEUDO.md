# Conteúdo do portal

O painel de produção fica em `/admin/`, com login em `/login/`. Notícias, artigos, rascunhos, destaques e imagens são gerenciados pela API Spring.

## Publicar pelo painel

1. Entre com uma conta autorizada pelo CCZ.
2. Abra Notícias ou Artigos e crie a publicação.
3. Edite o texto e envie a capa. O upload vai para `/midia` no Spring.
4. Salve o rascunho e use Publicar quando estiver pronto.
5. Organize a página inicial em Destaques.

O fluxo é navegador → `/api` → Spring → PostgreSQL/MinIO. Não há gravação de Markdown, assinatura de tokens ou commits Git no frontend. As permissões são verificadas pelo Spring em cada operação; ocultar controles na interface não substitui autorização no servidor.

Conteúdo publicado pela API aparece ao vivo sem gerar o site novamente. Despublicar mantém o registro como rascunho. Excluir remove o registro no backend e deve ser usado com cuidado; a recuperação depende dos backups do banco.

## Conteúdo estático existente

`content/articles/` e `content/news/` contêm material Markdown usado durante `npm run build`. Imagens desse material ficam em `public/img/`. A leitura de arquivos em `src/lib/cms` ocorre somente na geração estática; não constitui um backend em produção.

Esse acervo não é editado pelo painel. Para alterá-lo, edite o Markdown e gere o frontend novamente. O campo `draft: true` exclui um arquivo do site exportado. Remover uma publicação da API não remove uma cópia que exista no acervo estático; mantenha as duas fontes consistentes até migrar esse acervo ao Spring.

O app Node que existia na pasta `admin/` foi removido. Use somente o painel do frontend principal e o backend compatível indicado no README.
