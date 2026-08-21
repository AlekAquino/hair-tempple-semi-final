# Como contribuir

## Processo

1. Abra ou selecione uma Issue.
2. Crie uma branch curta e descritiva, como `fix/menu-mobile` ou `feat/galeria-espaco`.
3. Faça uma alteração por objetivo.
4. Execute as validações descritas em `AGENTS.md`.
5. Abra um Pull Request e inclua `Closes #N` na descrição.
6. Aguarde revisão e validações antes do merge.

## Regras de implementação

- Use HTML5, CSS moderno e JavaScript puro na versão estática.
- Preserve caminhos relativos compatíveis com GitHub Pages.
- Não use caminhos que comecem com `/asset/`.
- Mantenha controles acessíveis por teclado e áreas de toque de pelo menos 44 × 44 pixels.
- Respeite `prefers-reduced-motion`.
- A imagem principal não usa carregamento tardio; mídias abaixo da primeira dobra usam `loading="lazy"`.
- Não altere os arquivos em `asset/originals/`; gere novos derivados em `asset/production/`.

## Revisão de conteúdo

Qualquer informação não confirmada deve permanecer como placeholder legível no código e ser listada no PR. Nunca complete dados por suposição.
