# EvoluVita — Direção visual do site

Fonte: `EvoluVita_Manual_da_Marca.pdf` (v1.0, out/2026), `EvoluVita_Paleta_de_Cores.pdf`,
`EvoluVita_Media_Kit_Institucional.pdf` e o briefing. Quando este documento e o manual
divergirem, vale o manual.

## 1. Ideia central

**"Ascensão: apoio que abre possibilidades."** O símbolo são três curvas côncavas que
recebem (acolhimento) e sobem à direita (evolução). O site traduz isso em:

- **Curvas que sustentam**: linhas finas côncavas em taupe claro como grafismo de apoio
  (o manual permite "recortes ampliados das curvas em taupe claro, linhas discretas e
  molduras com áreas livres"). **Fotos sem moldura em arco** (pedido da cliente): fotos
  amplas, retas, com cantos discretos (8px) ou sangrando até a borda.
- **Referência aprovada pela cliente**: revitalizestudio.com.br — tipografia serifada
  grande com palavra em itálico, ritmo calmo, animações de revelação. Tudo, menos as
  fotos em arco.
- **Movimento que sobe à direita**: o único momento de movimento marcante do site é o
  método de atendimento, onde uma linha ascendente é desenhada conforme a rolagem.
- **Sofisticação por clareza**: muito marfim livre, poucas cores, tipografia grande,
  nada de ícones genéricos coloridos, nada de "clínica azul".

Personalidade (manual): forte, sofisticada, confiável e humana. Evitar infantilização,
fragilidade visual, excesso de informação, diminutivos e promessas de resultado.

## 2. Cor

| Token | HEX | Uso |
|---|---|---|
| `--marfim` | `#F3EFE7` | Fundo principal (oficial) |
| `--cafe` | `#6B5748` | Títulos, textos, botões (oficial). 5,94:1 sobre marfim |
| `--taupe` | `#887B6C` | Símbolo, grafismos, textos **grandes** apenas (3,59:1) |
| `--marfim-2` | `#EAE3D7` | Superfícies alternadas (derivado do marfim) |
| `--taupe-claro` | `#CFC5B8` | Linhas e curvas decorativas (o "taupe claro" do manual) |
| `--cafe-escuro` | `#3F332A` | Faixa de contato e rodapé, com a logo em versão clara |
| `--branco-quente` | `#FBF9F5` | Cartões sobre `--marfim-2` |

Regras: texto pequeno sempre em café (nunca taupe). Botões de WhatsApp no verde do WhatsApp (#25D366) com texto
verde-escuro (#06301F), a pedido da cliente; demais botões seguem a marca (café).

## 3. Tipografia

As fontes do manual são sugestões para reconstruir a logo; no site usamos a mesma
família de linguagem para manter coerência, **sem redigitar o nome EvoluVita** (a
logo é sempre a imagem aprovada).

- **Títulos**: Cormorant Garamond 500/600 — só em tamanhos ≥ 28px (tem traços finos).
- **Texto e interface**: Montserrat 400/500/600 — a fonte de apoio do manual.
- Raleway Light não é usada em texto corrido (o próprio manual alerta para traços finos).

Escala (fluida, `clamp`):

| Papel | Celular → Desktop |
|---|---|
| Display (hero) | 44px → 88px, Cormorant 500, entrelinha 1.02 |
| H2 | 34px → 60px, Cormorant 500, 1.08 |
| H3 | 24px → 30px, Cormorant 600 |
| Corpo | **18px** → 19px, Montserrat 400, entrelinha 1.65, até ~62 caracteres por linha |
| Sobretítulo | 13px, Montserrat 600, caixa alta, espaçamento 0.14em |

Corpo em 18px de propósito: muitos leitores são filhos de 45–65 anos lendo no celular.

## 4. Layout

- Grade de 12 colunas, largura máxima 1240px, margens 20px (celular) / 48px (desktop).
- Ritmo vertical generoso: seções com 96–160px de respiro.
- **Hero em foto ampla de ponta a ponta** (100% da largura, ~100svh), com véu café-escuro
  em degradê do lado do texto para garantir contraste; título e botão em marfim sobre a
  foto. Foto: a imagem editada da Mariana enviada pela cliente.
- Demais fotos: retângulos amplos, cantos de 8px, nunca em arco ou "janela".
- Botão de WhatsApp fixo no canto inferior direito; no celular vira uma barra discreta
  que aparece depois do hero e se esconde sobre a seção de contato (não cobre texto).
- Alvos de toque ≥ 48px; contraste AA em todo texto.

## 5. Estrutura da página inicial

1. **Topo** — logo (vertical, sem descritor), navegação, botão "Agendar avaliação".
2. **Hero** — foto ampla em tela cheia; "Cuidado em casa para seguir a vida com mais
   *autonomia*", cidades atendidas, botão de WhatsApp.
3. **Quando procurar** — situações do briefing (pós-internação, dores, medo de cair,
   AVC, Parkinson, Alzheimer e demências, fraqueza, dificuldade para levantar/caminhar).
4. **Como funciona (momento de movimento)** — 4 etapas do media kit: Escuta e avaliação,
   Plano individualizado, Acompanhamento, Continuidade e comunicação.
5. **Atendimento** — 6 frentes do media kit + diferenciais (sinais vitais, reavaliação,
   comunicação com a família).
6. **Quem somos** — Mariana Alves Campão, fundadora e responsável técnica,
   CREFITO-10 187677, trajetória; missão, visão e valores. Estrutura pronta para incluir
   mais profissionais.
7. **Galeria** — fotos reais de atendimento.
8. **Depoimentos** — estrutura pronta, **oculta até haver depoimentos reais** (não
   inventamos depoimentos).
9. **Para profissionais de saúde** — encaminhamentos e parcerias.
10. **Perguntas frequentes** — avaliação, quem pode se beneficiar, região, frequência,
    valores.
11. **Contato** — WhatsApp (47) 99252-1039, cidades. E-mail e redes entram quando existirem.

Blog/conteúdos educativos: a navegação e o rodapé já reservam lugar; não entra agora.

## 6. Movimento

Referência: as animações do Revitalize, que a cliente adorou. Implementação própria,
leve, sem bibliotecas pesadas: IntersectionObserver + CSS, e CSS `animation-timeline:
view()` para paralaxe. Curva padrão `--ease-acolhe: cubic-bezier(.22,1,.36,1)`; curva de
balanço `--ease-respira: cubic-bezier(.45,0,.55,1)`.

- **Títulos palavra por palavra**: cada palavra sobe de dentro de uma máscara, em cascata
  (60ms entre palavras, 1,1s). A palavra em itálico chega por último.
- **Revelação suave de blocos**: textos e cartões entram com opacidade, leve desfoque
  (6px) e 28px de subida, 1,1s.
- **Fotos com cortina**: uma cortina café-escuro recolhe para cima enquanto a foto faz
  um zoom de 1,15 para 1 (1,8s).
- **Hero**: a foto ampla faz um zoom lento de entrada (1,08 → 1) e acompanha a rolagem
  com paralaxe; o título entra palavra por palavra.
- **Linhas que se desenham**: fios divisórios crescem da esquerda; curvas decorativas
  côncavas (eco da Ascensão, sem redesenhar o símbolo) se desenham ao entrar na tela e
  depois balançam muito devagar (8s, ±2°).
- **Momento marcante — "Como funciona"**: linha do tempo vertical das 4 etapas; a linha
  se preenche conforme a rolagem e cada marcador acende quando a linha chega nele.
- **Topo inteligente**: transparente sobre o hero, ganha fundo marfim ao rolar e muda
  para versão clara sobre seções escuras.
- **Menu do celular**: abre em círculo a partir do botão.
- **Faixa contínua**: cidades e frentes de atendimento passando devagar (marquee),
  pausando ao passar o mouse.
- **`prefers-reduced-motion: reduce`**: nada se move; tudo aparece pronto. Se o
  JavaScript falhar, tudo aparece em até 3s.

## 7. Tecnologia

HTML, CSS e JavaScript estáticos (sem build), pensando em carregamento rápido e
publicação simples na Vercel. Animações em CSS + JavaScript próprio (sem dependências). Fontes do Google Fonts com `display=swap`. Imagens WebP em `assets/img/` com
`srcset` 800/1600 e `loading="lazy"` abaixo da dobra. SEO local: títulos e descrição
com "fisioterapia domiciliar para idosos em Balneário Camboriú, Camboriú e Itajaí" e
dados estruturados `MedicalBusiness`/`Physiotherapy`.

## 8. Pendências da marca

- Não existe arquivo da **assinatura horizontal aprovada**; o topo usa a vertical sem
  descritor em tamanho reduzido. Quando a horizontal existir, substituir.
- A logo do site foi recortada da imagem aprovada do manual (raster), sem redesenho.
  Trocar pelo vetor quando a vetorização estiver pronta.
- Depoimentos, e-mail e redes sociais: aguardando conteúdo real.
