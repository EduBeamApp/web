---
description: "Salve e abra projetos e sessões do EduBeam para desktop, compartilhe por link, incorpore um visualizador e exporte imagens e tabelas, tudo no navegador."
source: site
---

# Arquivos, links e exportação

:span{#importar-exportar-e-compartilhar}

Salve o modelo em um arquivo, envie-o como link, incorpore-o em uma página web ou exporte uma imagem ou uma tabela dele. Tudo no [EduBeam]{.edubeam} acontece no seu navegador, e nada é enviado a um servidor: um link de compartilhamento contém literalmente o modelo.

::card-grid{cols="3"}
:::card{title="Arquivo de projeto" icon="lucide:file-json" to="#save-a-project"}
`project.json` para guardar, entregar ou abrir depois.
:::
:::card{title="Link de compartilhamento" icon="lucide:link" to="#share-a-link"}
O modelo inteiro em uma URL, para notas de aula, slides e mensagens.
:::
:::card{title="Imagem ou tabela" icon="lucide:image" to="#export-an-image"}
PNG ou SVG para relatórios, CSV para planilhas.
:::
::

## Salvar um projeto {#save-a-project}

**☰ → Salvar projeto** ou <kbd>Ctrl</kbd>+<kbd>S</kbd> (<kbd>⌘</kbd>+<kbd>S</kbd> no Mac, como em todos os atalhos desta página) baixa o arquivo `project.json`. Ele contém os nós, os elementos, os materiais, as seções (com as formas desenhadas), as cargas, as linhas de cota e a versão do aplicativo que o gravou. Você pode renomear o arquivo à vontade.

## Abrir um projeto {#open-a-project}

**☰ → Abrir projeto** ou <kbd>Ctrl</kbd>+<kbd>O</kbd> e escolha o arquivo, ou **arraste o arquivo para qualquer lugar da janela do aplicativo**. O EduBeam abre:

- arquivos `project.json` salvos por qualquer versão do EduBeam;
- sessões `.xml` salvas pelo **EduBeam original para desktop**, versões 2.x a 3.5. Os valores delas não têm unidades, então são lidos em kN, kPa e m, as unidades que o manual daquele programa usava. O EduBeam abre um caso de carga por vez: de uma sessão com vários, ele abre o primeiro e informa quais deixou de fora.

Abrir um arquivo substitui o modelo atual, inclusive os materiais e as seções. O modelo que você tinha não se perde: <kbd>Ctrl</kbd>+<kbd>Z</kbd> o traz de volta, e ele fica guardado em [Estruturas recentes](#recent-structures). Um arquivo que o EduBeam não consegue ler é recusado com uma mensagem, e o seu modelo continua como estava.

## Compartilhar um link {#share-a-link}

**Compartilhar modelo**, na barra superior ou no menu ☰, abre o diálogo *Compartilhar modelo por URL*:

![O diálogo Compartilhar modelo por URL](/screenshots/pt/c1-share.webp){.shot-lg}

- **Copiar**, ou um clique em qualquer lugar do campo, copia o link.
- **Abrir link** abre o link em uma nova aba, para você ver o que o destinatário verá.
- **Compartilhar via diálogo do sistema** entrega o link ao menu de compartilhamento do seu dispositivo, quando o navegador permite.
- **Link mais curto** (ligado por padrão) grava o mesmo modelo com cerca de metade dos caracteres. Cópias do EduBeam anteriores à versão 1.3.2 (novembro de 2026) só conseguem lê-lo depois de atualizadas, então desligue a opção quando o link precisar abrir em qualquer lugar imediatamente.
- **Mostrar o que eu vejo** (desligado por padrão) faz o link abrir com os diagramas, as cargas e os rótulos que você deixou ligados, em vez das opções de exibição do próprio destinatário.

O link tem a forma `https://run.edubeam.app/?model=…` e codifica o modelo inteiro. Quem o abre recebe uma cópia própria para editar; as alterações **não** são sincronizadas de volta, então envie um novo link quando o modelo mudar. Modelos muito grandes geram links muito longos; nesse caso, compartilhe o arquivo de projeto.

Quando alguém abre um link, o modelo anterior dessa pessoa vai para Estruturas recentes, e uma mensagem diz onde encontrá-lo. Os links nunca expiram: um link nas notas de aula do ano passado abre hoje o mesmo modelo.

## Incorporar um visualizador {#embed-a-read-only-viewer}

Acrescente `&viewer=1` a um link de compartilhamento para abrir o modelo no **modo de visualização**: a barra superior, a barra inferior, desfazer e refazer, os botões da grade, o indicador de unidades e a mira ficam ocultos, restando o desenho, os botões de ajustar e centralizar e as opções de exibição. A janela de boas-vindas e as notas de versão também não se abrem. Coloque essa URL em um `<iframe>` para incorporar um modelo interativo, com zoom, em notas de aula, na página de uma disciplina ou em um slide:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![O pórtico triarticulado no modo de visualização](/screenshots/pt/viewer-mode.webp){.shot-lg}

O modo de visualização serve para olhar, mas não é bloqueado: os visitantes ainda podem arrastar nós e alternar diagramas. Aberto sozinho, um link de visualização substitui o modelo do visitante como qualquer link, e o modelo dele fica à espera em Estruturas recentes. Quando o link está incorporado em uma página de outro site, a maioria dos navegadores atuais dá ao quadro um armazenamento próprio, o que deixa intacto o modelo do visitante; mas nem todos os navegadores fazem isso.

Para uma figura que não precisa do aplicativo, como um diagrama estático numa página, num slide ou numa lista de exercícios, a biblioteca de desenho [@edubeam/plot](/pt/plot) desenha estruturas e seus diagramas a partir de código. As figuras interativas deste site são desenhadas com ela.

## Parâmetros de URL {#url-parameters}

| Parâmetro | Efeito |
| --- | --- |
| `model=<dados>` | Carrega o modelo codificado e o ajusta à tela. Gravado por **Compartilhar modelo**. |
| `viewer=1` | [Modo de visualização](#embed-a-read-only-viewer). |
| `show=<letras>` | Abre com exatamente estas camadas ligadas, uma letra para cada: `N` esforço normal, `V` esforço cortante, `M` momento fletor, `U` forma deformada, `R` reações, `L` cargas, `S` apoios, `n` rótulos dos nós, `e` rótulos dos elementos. `show=MRLS` mostra o momento fletor, as reações, as cargas e os apoios. Gravado por **Mostrar o que eu vejo**. |
| `lang=<código>` | Troca o idioma da interface: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (chinês), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Abre de imediato a galeria de exemplos. |

Os parâmetros se combinam com `&`, como em `?lang=pt&viewer=1&model=…`. Depois de lê-los, o EduBeam os remove da barra de endereço. `lang` e `show` ficam guardados como configurações do visitante, como se ele os tivesse escolhido no aplicativo.

## Exportar uma imagem {#export-an-image}

**☰ → Exportar imagem** ou <kbd>Ctrl</kbd>+<kbd>P</kbd> abre a exportação de imagem. O desenho é montado de novo para o tamanho escolhido, então as linhas e os rótulos mantêm sua espessura real.

![Exportar imagem: escolha as camadas, o enquadramento e o tamanho, depois baixe ou copie](/screenshots/pt/export-image.webp)

::div{.steps}

### Escolha as camadas {#choose-the-layers}

As etiquetas no topo escolhem o que é desenhado: a forma deformada, N, V, M e as reações, depois os apoios, as cargas, os rótulos dos nós e os rótulos dos elementos. Elas começam iguais às opções de exibição da visualização, e mudá-las aqui não altera a visualização.

### Enquadre o desenho {#frame-the-drawing}

Escolha uma proporção (16:9, 4:3, 3:2 ou 1:1), **Ajustar tudo** ou **Janela…** para arrastar um retângulo sobre o desenho. Você também pode arrastar as bordas da pré-visualização.

### Defina o tamanho {#set-the-size}

Largura e altura em pixels, ou uma **Escala** como 1 : 50 para um desenho em escala no papel (a 96 DPI). **Altura dos diagramas** define o tamanho dos diagramas de resultados, e **Fundo transparente** remove o branco. Se os diagramas ou os rótulos não couberem, o diálogo avisa e oferece reduzir os diagramas ou ampliar a área do desenho.

### Salve a imagem {#save-it}

**Baixar PNG**, **Baixar SVG** ou, quando o navegador permite, **Copiar para a área de transferência**. Os arquivos recebem o nome do seu tamanho, como `edubeam-512x512.svg`. Numa tela de alta resolução, o PNG tem mais pixels do que a largura e a altura definidas, na proporção da densidade de pixels da tela, para ficar tão nítido quanto no aplicativo; seu tamanho em pixels aparece ao lado dos botões.

::

O SVG fica nítido em qualquer tamanho e funciona no Word, no Inkscape e no LaTeX do Overleaf, o que o torna a melhor escolha para relatórios e trabalhos de conclusão de curso. O mesmo tamanho sempre enquadra a estrutura do mesmo jeito, então N, V e M exportados um após o outro ficam alinhados lado a lado.

Para gerar essas figuras por código, por exemplo uma para cada exercício de uma lista, a @edubeam/plot grava [um arquivo SVG independente](/pt/plot/functions#a-standalone-svg-file) que abre nos mesmos programas.

## Exportar os resultados {#export-the-results}

**Exportar CSV**, na aba **Resultados**, baixa as duas tabelas de resultados, incluindo as reações, e **Copiar** as coloca na área de transferência para uma planilha. Veja [Exportar CSV e Copiar](/pt/essentials/results#export-csv-and-copy).

## Estruturas recentes {#recent-structures}

**☰ → Estruturas recentes** guarda as últimas 10 estruturas que foram limpas ou substituídas por um link, um arquivo, um exemplo, a tarefa da primeira viga ou outra restauração. Cada uma mostra uma miniatura, o que a substituiu e seu número de nós e de elementos. **Restaurar** traz uma delas de volta: o modelo que você tinha nesse momento entra na lista, por sua vez, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> desfaz a restauração. **Remover** exclui uma entrada.

![Estruturas recentes](/screenshots/pt/recent.webp){.shot-lg}

A lista fica guardada apenas neste navegador.

## Exemplos {#examples}

**☰ → Exemplos** abre uma galeria de modelos didáticos prontos. Abrir um deles substitui o seu modelo, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> traz o seu de volta. Os mesmos modelos, com exercícios, estão na página [Exemplos](/pt/examples/) deste guia.

![A galeria de exemplos](/screenshots/pt/examples.webp){.shot-lg}

## Persistência automática {#automatic-persistence}

O seu modelo e as suas configurações são salvos no armazenamento local do navegador após cada alteração e restaurados quando você volta, mesmo depois de fechar o navegador. Isso é uma conveniência, não um backup: pertence a um perfil de navegador em um dispositivo, uma janela anônima o esquece, e limpar os dados do site o apaga. Salve os trabalhos importantes como arquivo de projeto. A seção [O que fica guardado no seu navegador](/pt/essentials/units-settings#what-is-stored-in-your-browser) lista tudo.

## Formato do arquivo de projeto {#project-file-format}

`project.json` é JSON simples e legível. Esta é a viga do [Início rápido](/pt/guide/quick-start), com o aço e o IPE 200 das bibliotecas:

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Todos os valores estão em **unidades SI** (m, N, Pa, rad), quaisquer que sejam as unidades exibidas no aplicativo. As coordenadas são `[x, y, z]`, com $y = 0$ e $z$ apontando para baixo. Os apoios e as componentes das cargas usam os identificadores de GL `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` da carga de elemento | Valores |
| --- | --- |
| `udl` | `values: [fx, fz]` em N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` em N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` em N, N·m e m a partir do nó inicial |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` em K; o gradiente é ΔTb − ΔTt |

`lcs: true`, ou a ausência de `lcs`, coloca a carga de elemento nos eixos locais do elemento; `false`, nos eixos globais. As demais entradas:

- **Cargas nodais**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, mais `"lcs": true` para uma carga nos eixos de um apoio girado.
- **Deslocamentos prescritos**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; uma componente omitida vale 0.
- Os arquivos gravados pelo aplicativo também trazem `date`, `commit`, os eixos dos apoios girados (`lcs` em um nó) e as formas desenhadas das seções (`shape`).

Como o formato é simples, você pode gerar modelos com um script ou uma planilha e abri-los com **Abrir projeto**. Para montar e resolver modelos inteiramente em código, use o solver por trás do aplicativo, a biblioteca de cálculo [@edubeam/fem](/pt/solver).
