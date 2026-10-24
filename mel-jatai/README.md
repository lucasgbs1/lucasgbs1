# Mel Nativo, loja e guia dos méis do Brasil

Loja de méis de abelhas nativas sem ferrão (jataí, mandaçaia, uruçu-nordestina e jandaíra) com um guia das abelhas que fazem mel no Brasil, região por região. "Mel Nativo" é um nome provisório: troque no `index.html` (logo, título, rodapé) e no comentário do topo de `main.js` e `styles.css`. Visual quente e tipográfico no estilo da eathungrytiger.com, só com fotografia real: o pote (foto recortada em tampa e corpo) gira e perde a tampa conforme a rolagem, e as cenas abrem fotos de Jataí, potes de cerume e mel escorrendo.

Não tem build. Abra `index.html` no navegador ou sirva a pasta (`npx serve mel-jatai`). Precisa de internet para as fontes e para as bibliotecas de animação.

## Arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Estrutura das seções |
| `styles.css` | Tokens em `:root`, layout e breakpoints em 1024 e 760 px |
| `main.js` | Catálogo, filtros, ficha, loja, cookies e toda a animação |
| `data.js` | Espécies, floradas, indicações geográficas e créditos das fotos |
| `img/` | Fotos em WebP: pote recortado, cenas (até 3840 px), espécies, floradas e mapas de ocorrência |

## Bibliotecas

GSAP 3.12.5 com ScrollTrigger (cdnjs) e Lenis 1.1.13 (unpkg), as mesmas peças que a referência usa. Se não carregarem, ou se o visitante preferir menos movimento, a página mostra tudo estático e continua funcionando.

## Como a animação do pote funciona

O pote fica num palco fixo (`.stage`). Uma linha do tempo do GSAP, presa à rolagem da `.journey`, leva o pote de um estado para o seguinte sempre que uma cena chega ao topo da tela. Os estados ficam no array `states` em `main.js` (posição, escala e rotação). A tampa é uma camada separada da mesma foto (`img/pote-tampa.webp`) e sai na cena "Abra o pote".

## Fotos

Todas são reais e vêm de bancos com licença livre: Wikimedia Commons (cenas, pote e mapas) e iNaturalist (espécies e floradas). Os créditos aparecem no rodapé, gerados a partir de `data.js`. As licenças CC BY e CC BY-SA exigem esse crédito; não remova.

A tiúba não tem foto com licença livre disponível, então o card dela mostra o mapa de ocorrência.

O pote é genérico, sem rótulo. Para a marca, faça uma sessão de fotos do produto (fundo neutro, 4K, mesma luz em todas) e troque `img/pote*.webp`. Com o produto real dá também para gerar uma sequência de quadros girando, que é o que a referência usa.

## O que revisar antes de publicar

- Temperamento, produção e curiosidades em `data.js`. As regiões seguem os mapas de ocorrência do Commons, mas o texto ainda precisa da revisão de um meliponicultor ou biólogo.
- Indicações geográficas: confira nome e tipo na base do INPI.
- Resumo da CONAMA nº 496/2020 na seção "Pode criar?".
- Preços (objeto `HONEYS` em `main.js`), CNPJ, endereço e números SIE/SIM/MAPA, que são espaços reservados.
- Quais méis a loja realmente vende. Cada mel precisa vir de meliponicultor com registro sanitário.
