# CVMais SEO-04: páginas de CV por profissão

Cinco novas páginas em português para Moçambique:
- /modelos/para/motorista
- /modelos/para/vendedor
- /modelos/para/estudante
- /modelos/para/administrativo
- /modelos/para/enfermeiro

Cada página tem texto original, exemplos assinalados como fictícios, competências, perguntas, metadata e breadcrumb JSON-LD. A landing page recomenda um desenho real já disponível; não cria um modelo profissional exclusivo. Faz ligação para o editor com modelo e área compatíveis.

Inclui alterações no sitemap, proxy, redireccionamento de domínios antigos e ligações internas a partir de /modelos.

Antes de merge: executar npm ci, npm test, npm run typecheck e npm run build; validar HTTP 200, canonical, sitemap, ausência de noindex e redireccionamentos de domínios antigos. Verificar os fluxos privados e PDF. Depois de merge, o deploy Vibehost DGC é manual e não deve alterar /data ou a configuração do servidor.

As palavras-chave são hipóteses editoriais; não implicam volumes confirmados pelo Keyword Planner.
