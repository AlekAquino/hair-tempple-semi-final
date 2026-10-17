# Estatísticas e verificação do site

A tag web é `G-N20ZXRCBJE`, para `https://hairtempple.com`. Esses identificadores são públicos e não são credenciais de administração.

## Comportamento

- As cinco páginas compartilham `analytics-consent.js` e `analytics-consent.css` por caminhos relativos.
- Antes da autorização e após recusar, a integração não carrega a biblioteca do Google Analytics. O mapa incorporado e os links externos que já existiam no site não fazem parte desse bloqueio.
- Aceitar permite estatísticas neste navegador por até 90 dias. Publicidade, personalização e Google Signals permanecem desabilitados na tag. Nenhum evento de conversão do Google Ads foi acrescentado.
- “Preferências de estatísticas”, no rodapé, permite mudar a escolha. Revogar desativa a coleta, remove os cookies Analytics desta propriedade e recarrega a página para descarregar a biblioteca. Requisições já enviadas não podem ser desfeitas.
- O carregamento está restrito a HTTPS no hostname exato `hairtempple.com`. Prévia local e forks não enviam visitas para a propriedade real.
- Query string e fragmento são retirados da URL inicial e do referenciador fornecidos à configuração. Isso não autoriza colocar dados pessoais em URLs ou conteúdo do site.
- Se o navegador bloquear o armazenamento local, a escolha funciona na página atual e uma nova escolha pode ser necessária ao navegar.

O aviso descreve o comportamento técnico implementado; não substitui revisão jurídica ou uma política de privacidade completa da empresa.

## Search Console

`google2542d6f2390b07c9.html` é o arquivo oficial de verificação da propriedade URL-prefixo `https://hairtempple.com/`. Mantenha-o na raiz após verificar; não exige alteração DNS.

## Validação

```sh
node --check analytics-consent.js
node --check script.js
node scripts/validate-static.mjs
node --test scripts/test-analytics-consent.mjs
```

O HTML foi verificado com `html-validate@11.16.2 --preset standard`, instalado em ambiente de QA separado do site. Conferir também teclado, preferências, menu, comparador, galeria e 360/390/768/1024/1440px em servidor estático.

Após publicar pela branch principal: conferir os arquivos via HTTPS, testar recusa e aceite observando a rede, confirmar recebimento no GA4 e concluir a verificação no Search Console. Testes locais não comprovam coleta no ambiente publicado.

## Reversão

Reverter o commit desta integração e publicar novamente pela branch principal remove a tag e os controles sem alterar conteúdo comercial ou assets. Uma reversão também remove o arquivo de verificação se ele fizer parte do commit revertido; revisar sua preservação para não perder a propriedade verificada. A escolha pode continuar guardada no navegador, mas não executa código sozinha.
