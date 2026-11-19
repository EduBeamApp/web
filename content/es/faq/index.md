---
description: "Respuestas breves sobre EduBeam: coste, uso sin conexión, privacidad, precisión, cómo se calculan los resultados, cómo citarlo, problemas, compartir y código."
source: site
---

# Preguntas frecuentes

Respuestas breves, cada una con un enlace a la página que trata el tema a fondo. ¿No encuentras la tuya? Consulta [Solución de problemas](/es/reference/troubleshooting) o [pregunta en GitHub](https://github.com/janvorisek/edubeam/issues).

## General {#general}

### ¿Qué es EduBeam? {#what-is-edubeam}

Una aplicación gratuita y de código abierto para el análisis estático lineal de vigas, pórticos y celosías 2D, pensada para estudiantes, docentes e ingenieros que quieren una respuesta inmediata. Funciona en el navegador. La [Introducción](/es/guide/introduction) explica qué hace y qué no.

### ¿De verdad es gratis? ¿Necesito una cuenta? {#is-it-really-free-do-i-need-an-account}

Sí, es gratis, y no, no necesitas cuenta. Abre [run.edubeam.app](https://run.edubeam.app/?lang=es){target="_blank"} y empieza a modelar: no hay nada que instalar ni límites de uso. El código fuente está en [GitHub](https://github.com/janvorisek/edubeam) con licencia GPL-3.0.

### ¿Qué navegadores y dispositivos funcionan? {#which-browsers-and-devices-work}

Cualquier versión actual de Chrome, Edge, Firefox o Safari, en un equipo, una tableta o un teléfono. En una pantalla táctil, toca para seleccionar, arrastra un nodo para moverlo, arrastra en otro sitio para desplazar la vista, pellizca para hacer zoom y mantén pulsado para abrir el menú del lienzo. Aun así, con ratón y teclado se modela más rápido. Consulta [Teclado, ratón y pantalla táctil](/es/reference/shortcuts#touch).

### He perdido mi modelo. ¿Puedo recuperarlo? {#i-lost-my-model-can-i-get-it-back}

Probablemente. Cuando se limpia un modelo, o cuando lo reemplaza un enlace, un archivo o un ejemplo, EduBeam lo conserva en **☰ → Estructuras recientes** (los 10 últimos), y <kbd>Ctrl</kbd>+<kbd>Z</kbd> deshace el reemplazo. Ambos existen solo en este navegador, así que un modelo de otro equipo o de otro perfil del navegador no aparece ahí. Consulta [Estructuras recientes](/es/essentials/import-export#recent-structures).

### ¿Puedo usarlo sin conexión? {#can-i-use-it-offline}

Sí. EduBeam es una aplicación web progresiva (PWA): una vez que tu navegador la ha cargado, sigue funcionando sin conexión, y el navegador puede ofrecer instalarla. Cuando sale una versión nueva, un diálogo te pregunta antes de actualizar.

### ¿Dónde se guardan mis datos? {#where-is-my-data-stored}

En tu navegador. No hay cuentas ni almacenamiento en la nube: la aplicación guarda tu modelo y tu configuración en este navegador, y un enlace para compartir lleva el modelo dentro del propio enlace. Consulta [Qué se guarda en tu navegador](/es/essentials/units-settings#what-is-stored-in-your-browser).

La aplicación de run.edubeam.app sí recoge estadísticas de uso (Google Analytics) e informes de errores (Sentry). Un informe de error, y la grabación que Sentry hace de una muestra de las sesiones, pueden incluir lo que había en pantalla, incluido tu modelo.

### ¿Dónde puedo practicar problemas de estática? {#practice}

En la página [Problemas para practicar](/es/practice). Cada vez te propone una viga, un pórtico o una celosía con valores nuevos: calcula en papel las reacciones y el momento flector máximo o el esfuerzo en una barra, escríbelos y cada valor se comprueba al instante. Los [ejemplos](/es/examples/) también traen preguntas y soluciones. Los docentes pueden imprimir un examen distinto para cada estudiante, con su hoja de soluciones, desde el [generador de exámenes](/es/exam); consulta [Problemas para practicar y exámenes](/es/guide/teaching#practice-and-test-papers).

### ¿Cómo cito EduBeam? {#cite}

Como software, con la versión y la fecha en que lo usaste. La versión aparece al final del menú **☰**. Por ejemplo:

> Voříšek, J. y colaboradores. *EduBeam*, versión 1.3.4 \[software\]. https://edubeam.app (consultado el 18 de noviembre de 2026).

Para referirte a un modelo concreto, añade su [enlace para compartir](/es/essentials/import-export#share-a-link): abre el mismo modelo para todos los lectores.

## Modelado {#modelling}

### ¿Cómo creo un empotramiento, un apoyo articulado o un apoyo móvil? {#how-do-i-make-a-fixed-pinned-roller-support}

Haz clic en el nodo, abre **Apoyos del nodo** y elige el símbolo: articulación, rodillo, empotramiento, deslizadera y más. O marca los grados de libertad restringidos en la pestaña **Nodos**: `Dx` + `Dz` + `Ry` es un empotramiento, `Dx` + `Dz` una articulación y `Dz` solo, un rodillo. En [Nodos y apoyos](/es/essentials/nodes-supports#supports) están todos los tipos.

### ¿Cómo hago una celosía? {#how-do-i-make-a-truss}

Dibuja las barras como elementos normales y libera los dos extremos de cada una: marca las dos **Rótulas de extremo** en la pestaña **Elementos**, o marca **Rótula al inicio** y **Rótula al final** en la franja superior antes de dibujar las barras con el ratón. Aplica las cargas en los nudos. El [tutorial de la celosía](/es/tutorials/truss) construye una paso a paso.

### ¿Cómo pongo una rótula en un pórtico? {#how-do-i-put-a-hinge-in-a-frame}

Libera el momento en el extremo del elemento que debe girar libremente: marca su rótula de extremo en la pestaña **Elementos**. Una rótula pertenece al extremo de un elemento, así que, en un nudo al que llegan varios elementos, liberar uno de ellos deja los demás unidos rígidamente. Consulta [Rótulas de extremo](/es/essentials/elements#end-hinges).

### ¿Cómo añado un apoyo o una carga puntual en el centro de una viga? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Para un apoyo, añade un nodo sobre la viga con el ratón (el botón **Añadir nodo** con el icono de cursor) y elige **Conectar a la estructura**: la viga se divide en dos en ese nodo y ya puedes apoyarla. Una carga puntual no necesita nodo: añade al elemento una **Carga concentrada** e indica su posición desde el nodo inicial. Consulta [Colocar un nodo sobre un elemento existente](/es/essentials/nodes-supports#placing-a-node-on-an-existing-element) y [Carga concentrada](/es/essentials/loads#concentrated-load).

### ¿Puedo aplicar el peso propio? {#can-i-apply-self-weight}

No automáticamente: la densidad del material no se usa en un análisis estático. Introdúcelo como carga uniformemente distribuida $f_z = \rho g A$; para un IPE 200, por ejemplo, $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, es decir, 0,22 kN/m.

### ¿Puedo modelar apoyos inclinados? {#can-i-model-inclined-supports}

Sí. Da al nodo un **Ángulo del SCL nodal**, y sus apoyos actúan entonces según los ejes girados. Consulta [Apoyos inclinados](/es/essentials/nodes-supports#inclined-skewed-supports).

### ¿Puedo trabajar en unidades estadounidenses? {#can-i-work-in-us-customary-units}

Sí. Haz clic en el botón de unidades, abajo a la derecha del visor, que abre **Configuración → Idioma y configuración regional**, y pon **Sistema de unidades** en **Estadounidense (imperial)** para trabajar en pies y kips, o elige cada unidad por separado. El modelo se guarda en SI, así que cambiar de unidades convierte lo que ves y nunca modifica el modelo. Consulta [Unidades y ajustes](/es/essentials/units-settings).

### ¿Hay casos de carga o combinaciones? {#are-there-load-cases-or-combinations}

No, un modelo tiene un solo caso de carga. Guarda cada caso en su propio archivo o enlace y combina los resultados por tu cuenta. Una sesión del EduBeam de escritorio con varios casos de carga se abre con el primero, y un mensaje indica cuáles se han omitido.

### ¿Por qué mis cargas apuntan hacia arriba? {#why-do-my-loads-point-up}

Seguramente porque has introducido un valor negativo. En EduBeam, el eje global z apunta **hacia abajo**, así que un `fz` o un `Fz` positivo es una carga gravitatoria, hacia abajo: 12 kN/m hacia abajo es `fz = 12`. Consulta [Sistema de coordenadas y convención de signos](/es/elements/conventions#loads). Si tu asignatura usa un eje vertical hacia arriba, cambia a **x a la derecha, y hacia arriba** en **Configuración → Idioma y configuración regional → Sistema de coordenadas**: los datos y los resultados siguen entonces ese eje.

## Resultados {#results}

### ¿Por qué no hay botón «Calcular»? {#why-is-there-no-solve-button}

Porque el modelo se vuelve a resolver tras cada cambio. Si no aparecen resultados, el modelo todavía no se puede resolver, y un mensaje en el lienzo explica por qué. [Solución de problemas](/es/reference/troubleshooting#no-results-are-drawn) indica qué comprobar.

### ¿Por qué mi flecha difiere ligeramente de la fórmula? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam usa elementos viga de Timoshenko, así que la flecha incluye la deformación por cortante, que las fórmulas de los libros suelen omitir. En una viga esbelta la diferencia ronda el 1 %, y el [Inicio rápido](/es/guide/quick-start#_8-check-by-hand) la suma a mano. En una estructura hiperestática, la rigidez a cortante también modifica ligeramente los esfuerzos. Más detalles en [Comprobar resultados a mano](/es/guide/verification).

### ¿Qué precisión tienen los resultados? ¿Necesito más elementos? {#how-accurate-are-the-results-do-i-need-more-elements}

En estática lineal, el elemento viga es exacto para todos los tipos de carga que ofrece EduBeam, así que basta un elemento por barra y no hay malla que refinar. Añade nodos solo donde necesites un apoyo, una rótula, un cambio de sección, una carga nodal o un desplazamiento que leer. Consulta [Precisión y exactitud](/es/essentials/results#precision-and-accuracy).

### ¿Cómo calcula EduBeam los resultados? {#how-does-edubeam-compute-the-results}

En tu navegador, con el método directo de la rigidez, la formulación del método de los elementos finitos que se enseña en las asignaturas de análisis estructural. [Cómo resuelve EduBeam un modelo](/es/elements/analysis) sigue cada paso con un pequeño ejemplo que puedes repetir a mano, y el propio solver es de código abierto: [@edubeam/fem](/es/solver).

### ¿Puedo ver las matrices de rigidez? {#can-i-see-the-stiffness-matrices}

Sí. En la pestaña **Elementos**, el botón de matriz de la fila de un elemento abre su matriz de rigidez de 6 × 6, en ejes globales y unidades SI (N, m). Al hacer clic en un elemento del visor también aparece **Matriz de rigidez**. La página [Elemento viga](/es/elements/beam#global-stiffness-matrix) la deduce.

### ¿Dónde aparecen las reacciones? {#where-are-the-reactions-listed}

En el visor, como flechas con sus valores: **Reacciones** en las opciones de visualización, activadas por defecto. También están en el archivo de **Resultados → Exportar CSV** y en lo que **Copiar** pone en el portapapeles. La pestaña **Resultados** muestra los desplazamientos nodales y las fuerzas en los extremos de los elementos. Consulta [Resultados y diagramas](/es/essentials/results).

## Archivos y compartir {#files-sharing}

### ¿Cómo comparto un modelo? {#how-do-i-share-a-model}

Pulsa **Compartir modelo** y después **Copiar**. El enlace contiene el modelo completo, y quien lo abre obtiene su propia copia para editarla: no hay colaboración en tiempo real. Activa **Mostrar lo que veo** para que el enlace se abra con tus diagramas y etiquetas activados. Consulta [Compartir un enlace](/es/essentials/import-export#share-a-link) y, para tus asignaturas, [Enseñar con EduBeam](/es/guide/teaching#in-lecture-notes-and-assignments).

### ¿Puedo incrustar un modelo en mi web o en unas diapositivas? {#can-i-embed-a-model-on-my-website-or-in-slides}

Sí. Añade `&viewer=1` a un enlace para compartir y ponlo en un `<iframe>`: consulta [Incrustar un visor](/es/essentials/import-export#embed-a-read-only-viewer). Para una figura estática en una página, una diapositiva o unos apuntes impresos, exporta un SVG o dibújala desde código con [@edubeam/plot](/es/plot).

### ¿Puedo exportar imágenes o tablas? {#can-i-export-images-or-tables}

Sí. **☰ → Exportar imagen** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) guarda el dibujo en PNG o SVG, con el tamaño o la escala que elijas. **Resultados → Exportar CSV** guarda las dos tablas de resultados, y **Copiar** las pone en el portapapeles para una hoja de cálculo. Consulta [Exportar una imagen](/es/essentials/import-export#export-an-image).

### ¿Puedo abrir archivos del EduBeam de escritorio? {#can-i-open-files-from-the-desktop-edubeam}

Sí. Las sesiones guardadas con el EduBeam de escritorio, de la versión 2.x a la 3.5 (`.xml`), se abren con **☰ → Abrir proyecto** o arrastrándolas a la aplicación, igual que un `project.json`. Sus valores se leen en kN, kPa y m. Consulta [Abrir un proyecto](/es/essentials/import-export#open-a-project).

### ¿Puedo generar modelos mediante programación? {#can-i-generate-models-programmatically}

Sí, de dos maneras:

- **Escribe el archivo.** Un `project.json` es un archivo JSON corriente en unidades SI, así que un script en cualquier lenguaje puede escribirlo, y EduBeam lo abre con **Abrir proyecto** o arrastrándolo. Consulta el [formato del archivo de proyecto](/es/essentials/import-export#project-file-format).
- **Resuélvelo en código.** [@edubeam/fem](/es/solver) es el solver de elementos finitos de EduBeam, como biblioteca de JavaScript y TypeScript. Después, [@edubeam/plot](/es/plot) dibuja el resultado, por ejemplo como una [hoja de ejercicios generada](/es/plot/exercises).

La viga del [Inicio rápido](/es/guide/quick-start), en unidades SI:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // apoyo articulado
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // apoyo móvil
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, hacia abajo

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m en el centro del vano
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m en el centro del vano
```

## Ayuda {#support}

### ¿Cómo informo de un error o pido una función nueva? {#how-do-i-report-a-bug-or-request-a-feature}

Abre una incidencia en [GitHub](https://github.com/janvorisek/edubeam/issues) y adjunta un enlace para compartir o un archivo de proyecto que muestre el problema. Para consultas privadas, escribe a [support@edubeam.app](mailto:support@edubeam.app).
