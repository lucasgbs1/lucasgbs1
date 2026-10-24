# Mel Jataí, landing page

Página de produto para mel de abelha Jataí (*Tetragonisca angustula*), em HTML, CSS e JavaScript puros. Não tem build nem dependência: abra `index.html` no navegador ou sirva a pasta com qualquer servidor estático (`npx serve mel-jatai`).

## Estrutura

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Marcação semântica de todas as seções e o SVG do pote (fonte única, clonado pelo JS) |
| `styles.css` | Tokens em `:root`, layout em Grid/Flexbox, breakpoints em 1068, 834 e 734 px |
| `main.js` | Rolagem com sticky, revelação por IntersectionObserver, animação em canvas, loja, cookies |

Seções: hero, história com sticky (420vh), bento de especificações, sensorial com controle de reprodução, loja com configuração e rodapé com notas, avisos regulatórios, seletor de região e preferências de cookies (LGPD).

## O que trocar antes de publicar

- **Vídeo sensorial**: preencha `data-video="media/sensorial.mp4"` no bloco `.media`. Sem isso, roda a animação em canvas.
- **Hero 3D**: o `<figure class="hero__stage">` aceita um `<video>` ou um canvas WebGL no lugar do SVG.
- **Preços**: objeto `PRODUCTS` em `main.js`.
- **Dados técnicos** (pH, umidade): os valores exibidos são faixas típicas da literatura. Substitua pelos números do laudo do lote.
- **Rodapé**: CNPJ, endereço, telefone, número SIF/SIE/registro e e-mail do encarregado são espaços reservados. Os selos são caixas genéricas, não reproduções dos selos oficiais.
- **Links legais**: Termos, Privacidade e demais páginas apontam para `#`.

## Acessibilidade e desempenho

Link de pular conteúdo, foco visível, rótulos ARIA na sacola e nos controles, `prefers-reduced-motion` respeitado (a animação começa pausada e as transições são desligadas). A rolagem usa um único `requestAnimationFrame` por quadro, e o canvas só anima quando está visível.
