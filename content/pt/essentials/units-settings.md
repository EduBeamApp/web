---
description: "Configurações do EduBeam: idioma, unidades SI ou americanas, formato numérico, eixos z para baixo ou y para cima, grade, diagramas, cores e dados no navegador."
source: site
---

# Unidades e configurações

Escolha o idioma, as unidades e os eixos com que você trabalha e a aparência do desenho. As configurações só mudam a forma como o modelo é exibido e digitado: o próprio modelo é sempre armazenado em unidades SI, com z apontando para baixo, então um projeto ou um link abre igual, quaisquer que sejam as configurações.

Há três caminhos para chegar a elas:

- a aba **Configurações**, acima da visualização, as mostra em tamanho inteiro no lugar do modelo, em *Idioma e localidade*; a aba **Estrutura** leva você de volta;
- o **indicador de unidades** no canto inferior direito da visualização (`m m² kN kNm MPa`) as abre como um diálogo em *Idioma e localidade*;
- **Mais configurações**, abaixo das [opções de exibição](/pt/essentials/user-interface#display-options), abre o diálogo em *Configurações de visualização*.

As configurações ficam salvas no navegador e continuam valendo quando você recarrega a página. **Redefinir configurações**, abaixo da lista de páginas, restaura os padrões: formato numérico, eixos, botão de panorâmica, as unidades da sua região e todas as configurações de visualização e opções de exibição. O idioma é mantido. Uma redefinição não pode ser desfeita.

## Idioma e localidade {#language-locale}

![Configurações → Idioma e localidade](/screenshots/pt/settings-language.webp)

**Idioma.** São 22 idiomas; na primeira visita, o EduBeam segue o idioma do navegador. O separador decimal acompanha o idioma. Um link pode escolher o idioma para quem o abre: acrescente `?lang=` com um destes códigos: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (chinês), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Formato numérico.** Como os valores dos resultados são escritos nas tabelas e nas dicas: *Científico* (1,5 · 10⁴, o padrão), *Engenharia* (15 · 10³) ou *Automático*. Veja [Formato numérico](/pt/essentials/results#number-format).

**Sistema de coordenadas.** *x para a direita, z para baixo* (o padrão) ou *x para a direita, y para cima*. Com *x para a direita, y para cima*, o eixo vertical se chama y e aponta para cima, e os momentos são em torno de z. As coordenadas verticais, as forças, os deslocamentos, as reações e os ângulos de apoio trocam de sinal, e todas as entradas, tabelas, dicas e exportações usam os novos nomes. O modelo, o desenho e os arquivos salvos continuam exatamente iguais. Veja [Eixos com y para cima](/pt/elements/conventions#y-up-axes).

![O pórtico triarticulado com eixos y para cima: o indicador de eixos no canto aponta y para cima](/screenshots/pt/settings-y-up.webp){.shot-lg}

**Sistema de unidades.** *SI (métrico)* ou *Americano (imperial)* define todas as unidades de uma vez. Na primeira visita, você escolhe na janela de boas-vindas. O EduBeam só sugere as unidades americanas quando o navegador está configurado com uma localidade dos EUA *e* o computador está num fuso horário dos EUA; em todos os outros casos, sugere o SI. Se depois você mudar qualquer unidade individual, o sistema aparece como *Personalizado*.

### Unidades {#units}

Cada grandeza tem sua própria unidade. As entradas (que a mostram no fim do campo), as tabelas, as dicas e os rótulos dos diagramas usam essa unidade, e mudar uma unidade converte o que é exibido. Nada no modelo muda, então você pode trocar de unidade quantas vezes quiser sem perder nada.

| Grandeza | Opções | SI | Americano |
| --- | --- | --- | --- |
| Comprimento (geometria, posições das cargas) | m, cm, mm, ft, in | m | ft |
| Dimensões da seção | m, cm, mm, ft, in | m | in |
| Deslocamento (resultados, recalques prescritos) | m, cm, mm, ft, in | m | in |
| Área | m², cm², mm², ft², in² | m² | in² |
| Segundo momento de área (momento de inércia) | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Massa | kg, lb | kg | lb |
| Força | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Momento fletor | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Tensão (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatura | °C, °F | °C | °F |

Algumas unidades derivam das outras:

- As **cargas distribuídas** são força por comprimento: kN/m no SI, kip/ft nas unidades americanas.
- A **massa específica** (no aplicativo, *Densidade*) é massa por volume (comprimento³): kg/m³ ou lb/ft³.
- O **coeficiente de dilatação térmica** segue a temperatura: 1/K ou 1/°F. As cargas térmicas são *variações* de temperatura, então uma variação de 10 °C equivale a 18 °F.
- As **rotações** são sempre em radianos, e os ângulos de apoio em graus.

Tonf é a tonelada-força métrica (1000 kgf), não a tonelada curta americana. As unidades americanas seguem suas definições exatas: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Digite os pés como números decimais, por exemplo `5,5`; as réguas e a mira mostram pés e polegadas (5′-6″).

## Configurações de visualização {#viewer-settings}

Aqui se define a aparência do desenho. A **Pré-visualização**, à direita, é uma pequena viga inclinada que mostra cada alteração na hora; os botões abaixo dela escolhem qual resultado ela mostra, e mudar uma configuração de diagrama ou uma cor passa a pré-visualização para aquele resultado.

![Configurações → Configurações de visualização, com a pré-visualização ao vivo e as configurações dos diagramas à direita](/screenshots/pt/b-settings-viewer.webp)

A coluna da esquerda, de cima para baixo:

- *Grade*: **Mostrar grade** (<kbd>G</kbd>) desenha a grade e as réguas; **Encaixar na grade** (<kbd>S</kbd>) encaixa nela os nós que você posiciona ou arrasta; **Mostrar mira** marca a posição do ponteiro nas réguas, quando se usa o mouse. As três vêm ligadas. O **Passo do encaixe na grade** é de 0,1 m, ou 0,5 ft em unidades americanas. Ao alternar entre unidades métricas e americanas, um passo que ainda está no padrão passa para o padrão do outro sistema; um passo definido por você é mantido.
- *Tamanhos*: a **Escala de resultados**, de 8 a 120 px (48 px inicialmente), é a altura com que se desenha a maior ordenada de um diagrama, ou a maior flecha; é puramente visual, pois cada diagrama é escalado pelo seu próprio valor máximo. O **Tamanho dos apoios** vai de 50 a 150 % (100 %), e o **Tamanho da fonte**, de 10 a 20 px (14 px); valores maiores ajudam no projetor.
- *Orientação dos rótulos de resultados*: *Perpendicular ao diagrama* (o padrão), com os valores escritos ao longo da ordenada, ou *Sempre horizontais*.
- *Verificação do modelo*: **Mostrar como uma estrutura instável pode se mover** desenha um contorno tracejado do mecanismo, e **Animar o movimento** o faz oscilar de um lado para o outro. As duas vêm ligadas.

### Diagramas de esforços internos {#internal-force-diagrams}

Cada escola desenha os diagramas de um jeito, por isso o EduBeam deixa você escolher. Estas configurações mudam apenas o desenho, nunca os valores. A **linha tracejada** ao longo de cada elemento marca suas fibras inferiores, o lado para onde aponta o seu z local (veja [Orientação do elemento](/pt/essentials/elements#element-direction)).

| Configuração | Opções | Padrão |
| --- | --- | --- |
| **Momento fletor** | desenhado no *Lado tracionado* ou no *Lado comprimido* | *Lado tracionado* |
| **Esforço cortante positivo** | desenhado no *Lado oposto* à linha tracejada ou no *Lado tracejado* | *Lado oposto* |
| **Esforço normal positivo** | *Lado oposto* ou *Lado tracejado* | *Lado oposto* |
| **Preenchimento** | *Sólido*, *Hachurado* (linhas transversais à barra, como no desenho à mão) ou *Nenhum* | *Sólido* |
| **Grau de cada trecho** | escreve o grau do polinômio, de 0° a 3°, em cada trecho de um diagrama | desligado |

Em [Resultados e diagramas](/pt/essentials/results#reading-the-sign) você vê como ler os sinais.

### Cores {#colors}

Cores separadas para nós, elementos, cargas, forma deformada, esforço normal, esforço cortante, momento fletor e reações. Clique em uma amostra para escolher a cor. Os padrões: cargas em laranja, forma deformada em cinza, N em azul, V em verde, M em vermelho, reações em roxo, nós e elementos em preto.

## Controles e atalhos {#controls-shortcuts}

**Panorâmica com** define qual botão do mouse arrasta a vista: *Roda do mouse ou botão direito* (o padrão), *Roda do mouse* (pressione a roda e arraste) ou *Botão direito*. Todos os atalhos estão na página [Teclado, mouse e toque](/pt/reference/shortcuts).

## O que fica guardado no seu navegador {#what-is-stored-in-your-browser}

Além das configurações, o EduBeam guarda no armazenamento local do navegador:

- o **modelo atual**, salvo após cada alteração, de modo que recarregar a aba ou reabrir o aplicativo o traz de volta;
- as **Estruturas recentes**: os últimos 10 modelos que você limpou ou substituiu, prontos para restaurar pelo menu ☰.

Os dois pertencem a este navegador neste dispositivo, e limpar os dados do site os apaga. Para guardar um modelo ou levá-lo para outro dispositivo, use [Salvar projeto ou Compartilhar modelo](/pt/essentials/import-export).
