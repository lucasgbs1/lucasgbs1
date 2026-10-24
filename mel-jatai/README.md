# Jataí, site de mel e guia dos méis do Brasil

Loja do mel de Jataí com um guia das abelhas que fazem mel no Brasil, região por região. Visual quente e tipográfico, com o pote que gira, perde a tampa e despeja o mel conforme a rolagem.

Não tem build. Abra `index.html` no navegador ou sirva a pasta (`npx serve mel-jatai`). Precisa de internet para as fontes e para as bibliotecas de animação.

## Arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Estrutura das seções e os SVGs do pote (vista lateral e de cima) |
| `styles.css` | Tokens em `:root`, layout e breakpoints em 1024 e 760 px |
| `main.js` | Catálogo, filtros, ficha, loja, cookies e toda a animação |
| `data.js` | Espécies, floradas e indicações geográficas. Edite aqui para mudar o conteúdo |
| `assets/flora.svg` | Padrão botânico do fundo |

## Bibliotecas

GSAP 3.12.5 com ScrollTrigger (cdnjs) e Lenis 1.1.13 (unpkg), as mesmas peças que a referência usa. Se não carregarem, ou se o visitante preferir menos movimento, a página mostra tudo estático e continua funcionando.

## Como a animação do pote funciona

O pote fica num palco fixo (`.stage`). Uma linha do tempo do GSAP, presa à rolagem da `.journey`, leva o pote de um estado para o seguinte sempre que uma cena chega ao topo da tela. Os estados ficam no array `states` em `main.js` (posição, escala, rotação e se mostra a vista de cima). A tampa sai na cena "Abra o pote" e o fio de mel é um traço SVG desenhado na última cena.

Para chegar ao nível da referência, troque o SVG por uma sequência de imagens renderizadas em 3D (ou um vídeo) controlada pela mesma linha do tempo.

## O que revisar antes de publicar

- Distribuição das espécies por região, temperamento, produção e curiosidades em `data.js`. É conteúdo de referência geral e precisa da revisão de um meliponicultor ou biólogo.
- Indicações geográficas: confira nome e tipo na base do INPI.
- Resumo da CONAMA nº 496/2020 na seção "Pode criar?".
- Preços, CNPJ, endereço e números SIE/SIM/MAPA, que são espaços reservados.
