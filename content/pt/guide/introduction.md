---
description: "O EduBeam, programa gratuito de MEF no navegador para vigas, pórticos e treliças 2D: o que faz e não faz, para quem é, como usar o guia e as bibliotecas."
source: site
---

# Introdução

O [EduBeam]{.edubeam} é um aplicativo gratuito de análise estrutural de **vigas, pórticos e treliças** que roda no navegador. Você desenha a estrutura, coloca os apoios e as cargas, e o solver de elementos finitos recalcula os diagramas, as reações e as flechas a cada alteração. Não há botão *Calcular*, nada para instalar e nenhum cadastro.

::div{.actions}
[Abrir o EduBeam ↗](https://run.edubeam.app/?lang=pt){target="_blank"} [Início rápido em 10 minutos](/pt/guide/quick-start)
::

![Um pórtico triarticulado no EduBeam: cargas em laranja, reações em roxo, o momento fletor em vermelho e a deformada em cinza](/screenshots/pt/hero.webp)

:span{#your-first-visit}

## O que ele faz {#what-it-does}

::card-grid{cols="2"}
:::card{title="Estruturas" icon="lucide:triangle" to="/pt/essentials/elements"}
Vigas, vigas contínuas, pórticos e treliças no plano x–z, formados por elementos de viga de Timoshenko. Rótulas de extremidade transformam uma barra em barra de treliça.
:::
:::card{title="Apoios" icon="lucide:anchor" to="/pt/essentials/nodes-supports#supports"}
Apoio fixo, apoio móvel, engaste, engaste deslizante ou qualquer combinação de `Dx`, `Dz` e `Ry` restringidos, escolhida pelo símbolo. Apoios inclinados e recalques.
:::
:::card{title="Cargas" icon="lucide:arrow-down-to-line" to="/pt/essentials/loads"}
Forças e momentos nos nós ou em qualquer ponto de uma barra, cargas distribuídas uniformes e trapezoidais, cargas térmicas e deslocamentos prescritos.
:::
:::card{title="Seções" icon="lucide:shapes" to="/pt/essentials/elements#cross-sections"}
Bibliotecas europeias e americanas ou qualquer polígono que você desenhar, com $A$, $I_y$, $I_z$, $I_{yz}$, eixos principais e raios de giração calculados.
:::
:::card{title="Resultados" icon="lucide:chart-spline" to="/pt/essentials/results"}
Diagramas de **N**, **V** e **M**, a deformada, as reações, os deslocamentos nodais, os esforços de extremidade e as matrizes de rigidez dos elementos.
:::
:::card{title="Análise" icon="lucide:calculator" to="/pt/elements/analysis"}
Estática linear, exata para o modelo linear: não há malha para refinar. Quando a estrutura não se sustenta, o EduBeam explica por quê e mostra o movimento dela em animação.
:::
:::card{title="Arquivos" icon="lucide:folder-open" to="/pt/essentials/import-export"}
Projetos em JSON, modelos inteiros como links, desenhos em PNG ou SVG, resultados em CSV. Os modelos substituídos ficam guardados, e nada sai do seu dispositivo.
:::
:::card{title="Unidades" icon="lucide:ruler" to="/pt/essentials/units-settings"}
SI ou unidades americanas com um clique, ou grandeza por grandeza. O eixo z para baixo ou o y para cima, como nos livros.
:::
::

## O que ele (ainda) não faz {#what-it-does-not-do-yet}

Conhecer os limites de antemão poupa tempo:

::div{.limits}
- **Somente 2D.** Sem comportamento fora do plano, sem pórticos espaciais.
- **Somente estática linear.** Sem efeitos de segunda ordem (P–Δ), flambagem, dinâmica ou plasticidade.
- **Um caso de carga.** Sem combinações nem envoltórias: salve cada caso como arquivo ou link próprio.
- **Sem peso próprio.** Aplique-o como carga distribuída.
- **Sem verificações normativas.** O EduBeam fornece esforços internos e deslocamentos; as verificações segundo a norma ficam por sua conta.
::

Se falta algum recurso importante para você, [abra uma issue](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Para quem é? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Alunos" icon="lucide:graduation-cap" to="/pt/practice"}
Retorno imediato sobre os cálculos feitos à mão e exercícios que conferem as suas respostas à medida que você avança.
:::
:::card{title="Professores" icon="lucide:presentation" to="/pt/guide/teaching"}
Mostre ao vivo no projetor, em 18 idiomas, como apoios, rótulas e cargas alteram os esforços, e imprima uma prova diferente para cada aluno.
:::
:::card{title="Engenheiros" icon="lucide:hard-hat" to="/pt/elements/analysis"}
Uma verificação rápida antes de abrir um programa de desktop mais pesado, com cada passo da solução documentado.
:::
:::card{title="Desenvolvedores" icon="lucide:code-xml" to="#libraries"}
O solver e os desenhos por trás do EduBeam, como bibliotecas de código aberto para o seu próprio código.
:::
::

## Como se orientar no guia {#how-this-guide-is-organised}

A barra lateral agrupa as páginas como abaixo. Os botões **?** do aplicativo abrem a página correspondente deste guia, no seu idioma.

::card-grid{cols="2"}
:::card{title="Primeiros passos" icon="lucide:flag" to="/pt/guide/quick-start"}
Esta página e o Início rápido: a primeira viga em dez minutos.
:::
:::card{title="Montar o modelo" icon="lucide:pencil-ruler" to="/pt/essentials/user-interface"}
A interface, nós e apoios, elementos, materiais e seções, cargas, unidades e configurações.
:::
:::card{title="Ler os resultados" icon="lucide:chart-spline" to="/pt/essentials/results"}
Os diagramas e as tabelas de resultados, e como conferi-los à mão.
:::
:::card{title="Compartilhar e ensinar" icon="lucide:share-2" to="/pt/essentials/import-export"}
Arquivos de projeto, links de compartilhamento, exportação de imagem e CSV, e como ensinar com o EduBeam.
:::
:::card{title="Tutoriais" icon="lucide:triangle" to="/pt/tutorials/inclined-beam"}
Uma viga inclinada, um pórtico triarticulado, uma treliça plana e uma viga contínua com recalque de apoio, cada um montado passo a passo e conferido à mão.
:::
:::card{title="Exemplos" icon="lucide:library" to="/pt/examples/"}
Seis modelos prontos que abrem com um clique, com exercícios e respostas.
:::
:::card{title="Manual teórico" icon="lucide:sigma" to="/pt/elements/conventions"}
Eixos e convenções de sinais, os elementos de viga e de treliça e como o EduBeam resolve um modelo.
:::
:::card{title="Ajuda" icon="lucide:life-buoy" to="/pt/reference/shortcuts"}
Teclado, mouse e toque, solução de problemas e as perguntas frequentes.
:::
::

## Crie suas próprias ferramentas {#libraries}

O EduBeam se apoia em duas bibliotecas de código aberto, documentadas neste site. Com elas você resolve estruturas em um script, gera um exercício diferente para cada aluno ou desenha figuras para slides e notas de aula.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/pt/solver"}
O solver de elementos finitos do EduBeam, em TypeScript: modele uma viga, resolva-a e leia os resultados em uma dúzia de linhas, no navegador ou no Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/pt/plot"}
Componentes Vue 3 que desenham uma estrutura resolvida em SVG, com as cargas, as reações e os diagramas de N, V e M.
:::
::

## Idiomas {#languages}

O EduBeam fala 18 idiomas e abre no idioma do seu navegador. Para mudar, use **Configurações → Idioma e localidade** ou escolha um aqui:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

Um link também pode escolher o idioma no lugar do leitor: `run.edubeam.app/?lang=pt` abre em português.

## Autores e créditos {#authors-credits}

O [EduBeam]{.edubeam} é desenvolvido por [Jan Voříšek](https://github.com/janvorisek) como projeto independente. Ele dá continuidade ao EduBeam original para desktop (Windows e Linux), criado por [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) e [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) no Departamento de Mecânica da [Faculdade de Engenharia Civil da Universidade Técnica Tcheca de Praga (ČVUT)](https://www.fsv.cvut.cz/en), e ainda abre as sessões salvas nele. O solver, [@edubeam/fem](/pt/solver), nasceu da primeira versão escrita por Bořek Patzák. O aplicativo e o solver são de código aberto, sob a licença GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Desenvolvedor principal e designer de produto","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Desenvolvedor: controle por toque, desempenho do desenho, cargas e apoios","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"EduBeam original e o primeiro solver MEF","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Contribua {#contribute}

::card-grid{cols="3"}
:::card{title="Relatar um problema" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Algo confuso, errado ou quebrado? Uma issue no GitHub chega direto à equipe.
:::
:::card{title="Melhorar uma tradução" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Os textos do aplicativo ficam em um arquivo por idioma; pull requests são bem-vindos.
:::
:::card{title="Divulgue" icon="lucide:share-2"}
Indique o EduBeam a colegas de turma e de trabalho, ou coloque o link de um modelo nas suas notas de aula.
:::
::
