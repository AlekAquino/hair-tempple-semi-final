# Instruções para agentes

Estas regras se aplicam a qualquer agente ou modelo que altere este projeto.

## Fluxo obrigatório

1. Crie uma Issue para cada correção, melhoria ou nova função relevante.
2. Trabalhe em uma branch específica para a tarefa.
3. Entregue a alteração por Pull Request.
4. A descrição do PR deve mencionar a Issue no formato `Closes #N`.
5. Faça deploy somente pela branch principal.
6. Integre o PR somente depois das validações obrigatórias.

Não crie Issues, branches remotas, PRs ou deploys sem autorização e sem o endereço do repositório.

## Conteúdo e assets

- Preserve os arquivos originais; não os edite nem os sobrescreva.
- Coloque derivados otimizados em `asset/production/` com nomes minúsculos, sem acentos, sem espaços e separados por hífen.
- Não invente informações comerciais, contatos, endereço, horários, preços, avaliações, políticas, garantias, premiações ou certificações.
- Use os documentos em `docs/source-of-truth/` como fonte principal.
- Mantenha a localização textual consistente como `Porto Alegre — RS`.
- Não adicione `CNAME`, canonical ou domínio ao sitemap sem receber o domínio exato.

## Validações antes do merge

- HTML válido e hierarquia semântica correta.
- JavaScript sem erro de sintaxe e console limpo.
- CSS e assets carregados sem caminhos quebrados.
- Navegação por teclado, menu e comparadores funcionais.
- Verificação responsiva em 360, 390, 768, 1024 e 1440px.
- Ausência de rolagem horizontal involuntária e conteúdo cortado.
- Conferência de WhatsApp, Maps, Instagram e dos oito links de avaliações.
- Teste das páginas inicial e `o-espaco/index.html` em servidor estático.
