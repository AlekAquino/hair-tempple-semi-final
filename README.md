# Hair Tempple

Site estático da Hair Tempple, preparado para publicação pelo GitHub Pages. A página não depende de backend, PHP ou banco de dados.

## Estrutura principal

- `index.html`: página inicial.
- `styles.css`: estilos responsivos.
- `script.js`: menu, carrosséis e comparadores.
- `servicos/index.html`: serviços capilares agrupados e valores iniciais.
- `produtos/index.html`: catálogo de produtos e cabelos disponíveis.
- `faq/index.html`: perguntas frequentes sobre Mega Hair e produtos.
- `o-espaco/index.html`: guia visual do espaço.
- `asset/production/`: imagens otimizadas usadas pelo site.
- `asset/originals/`: arquivos originais preservados.
- `docs/source-of-truth/`: textos e links de referência.

## Teste local

Não valide apenas com `file://`. Na pasta do projeto, execute:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080/`.

## Abrir no GitHub Desktop

1. Extraia a pasta do projeto no computador.
2. No GitHub Desktop, escolha **File → Add local repository**.
3. Selecione a pasta extraída.
4. Caso ainda não exista um repositório, use **Create a repository** para inicializá-lo.
5. Revise os arquivos e publique somente quando a versão estiver aprovada.

## Publicar no GitHub Pages

1. Publique o repositório pelo GitHub Desktop.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/ (root)`.
5. Salve e aguarde o endereço do GitHub Pages.

Todos os caminhos do site são relativos e funcionam em uma subpasta como `usuario.github.io/nome-do-repositorio/`.

## Domínio personalizado e HTTPS

O domínio definitivo ainda não foi informado; por isso, o projeto não inclui `CNAME`, URL canônica ou sitemap com domínio inventado.

Depois de definir o domínio:

1. Em **Settings → Pages**, preencha **Custom domain**.
2. No painel DNS do Squarespace, configure os registros indicados pelo GitHub Pages para o domínio raiz ou subdomínio escolhido.
3. Adicione na raiz do repositório um arquivo `CNAME` contendo somente o domínio exato.
4. Após a validação do DNS, ative **Enforce HTTPS**.
5. Atualize `sitemap.xml`, `robots.txt`, Open Graph e a URL canônica com o domínio aprovado.

## Fluxo de atualização

Mudanças relevantes devem seguir o processo registrado em `AGENTS.md` e `CONTRIBUTING.md`: Issue, branch específica, Pull Request com `Closes #N`, validações e merge na branch principal.

## Fontes e limites de conteúdo

- WhatsApp e Maps vêm dos arquivos em `docs/source-of-truth/`.
- A história das especialistas vem integralmente do Markdown de referência.
- Serviços e preços vêm da tabela datada de 20/08/2026 preservada em `docs/source-of-truth/`.
- Produtos e preços vêm da tabela datada de 20/08/2026; fotos e descrições foram conferidas em páginas oficiais dos fabricantes.
- As oito avaliações compartilhadas foram abertas e mapeadas em `docs/source-of-truth/avaliacoes-verificadas.md`.
- A localização textual aprovada é **Porto Alegre — RS**.
- O Instagram oficial é `https://www.instagram.com/hairtempple/`.
- Não inventar preços, horários, endereço completo, políticas, garantias, formas de pagamento, contatos, prêmios ou certificações.
- Os arquivos em `asset/originals/` não devem ser editados nem sobrescritos. Gere derivados em `asset/production/`.

## Dados pendentes antes da aprovação final

- O comentário de Camille Muner consta no material fornecido, mas nenhum dos oito links específicos abre a avaliação dela. O card usa a ficha geral do Google e identifica essa limitação no próprio site.
- A nomenclatura `Shampoo Detox Therapy` não identifica uma embalagem oficial inequívoca. A página usa uma imagem de referência da linha Detox e solicita confirmação da apresentação pelo WhatsApp.
- Informar o domínio definitivo antes de criar `CNAME`, canonical e URLs absolutas do sitemap.
