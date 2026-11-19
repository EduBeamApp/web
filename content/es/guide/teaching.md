---
description: "Enseñar con EduBeam: modelos proyectados en directo, enlaces en los apuntes, tareas autocomprobables, problemas generados y exámenes impresos con soluciones."
source: site
---

# Enseñar con EduBeam

[EduBeam]{.edubeam} nació en un aula, y ahí sigue funcionando mejor: un modelo en el proyector que reacciona en cuanto lo cambias, y el mismo modelo en el portátil de cada estudiante gracias a un enlace. Esta página reúne lo que más usan los docentes, desde la primera clase hasta el examen.

::card-grid{cols="2"}
:::card{title="En clase" icon="lucide:presentation" to="#in-the-lecture"}
Haz que el modelo se lea desde la última fila y modifícalo en directo.
:::
:::card{title="En la primera clase práctica" icon="lucide:graduation-cap" to="#getting-students-started"}
Diez minutos desde una pantalla vacía hasta una viga comprobada a mano.
:::
:::card{title="En apuntes y ejercicios" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Un enlace en un PDF o en una diapositiva abre el modelo completo, durante años.
:::
:::card{title="Tareas autocomprobables" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Primero el cálculo a mano; después, el modelo como comprobación.
:::
:::card{title="Problemas y exámenes" icon="lucide:file-check" to="#practice-and-test-papers"}
Problemas generados que se corrigen al instante, y exámenes para imprimir con sus soluciones.
:::
:::card{title="Hojas de ejercicios y diapositivas desde código" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Tus propios generadores de ejercicios y figuras para diapositivas, escritos con @edubeam/plot.
:::
::

## En clase {#in-the-lecture}

- **Que se lea desde la última fila.** En **Configuración → Ajustes del visor**, sube el **Tamaño de fuente** a 18 o 20 px (20 px es el máximo) y el **Tamaño de apoyos** a 130–150 %. Si los diagramas siguen viéndose pequeños, aumenta la **Escala de resultados**.
- **Muestra una cosa cada vez.** En las opciones de visualización, arriba a la derecha del visor, desmarca todo excepto la magnitud de la que estás hablando y luego añade las demás una a una.
- **Cambia el modelo en directo.** Arrastra un apoyo, marca `Ry`, añade una rótula. Los estudiantes ven al instante la causa y el efecto, y <kbd>Ctrl</kbd>+<kbd>Z</kbd> te devuelve al punto anterior.
- **Deja que el solver explique los mecanismos.** Libera una rótula de más y EduBeam dibuja cómo puede moverse la estructura, lo anima y rodea con un círculo las rótulas responsables. Es un buen momento para hablar de estabilidad. Ambas opciones están en **Configuración → Ajustes del visor → Comprobación del modelo**.
- **Usa el idioma y los ejes de tus estudiantes.** EduBeam habla 18 idiomas, y en [Configuración](/es/essentials/units-settings) puedes cambiar entre unidades SI y estadounidenses, y entre ejes con z hacia abajo o con y hacia arriba, para que coincidan con tus apuntes.

![Un mecanismo a la vista: las rótulas en B y C permiten el desplome del pórtico](/screenshots/es/ui-mechanism.webp)

## En la primera clase práctica {#getting-students-started}

En su primera visita, EduBeam pregunta a los estudiantes cómo quieren empezar y qué unidades y ejes usar. Diles de antemano qué unidades y ejes usa tu asignatura. El recorrido (**Hacer un recorrido**), la tarea guiada **Dibuja tu primera viga** y los **Ejemplos** siguen disponibles después en el menú **☰**.

Una buena primera clase práctica: pide a tus estudiantes que abran run.edubeam.app y elijan *Dibuja tu primera viga*, y que sigan después el [Inicio rápido](/es/guide/quick-start), unos diez minutos con una comprobación a mano al final.

### Equipos del aula de informática y uso sin conexión {#offline-and-lab-computers}

EduBeam es una aplicación web progresiva (PWA): una vez que el navegador la ha cargado, sigue funcionando sin conexión, y el navegador puede ofrecer instalarla como una aplicación de escritorio. El modelo y la configuración se guardan por perfil de navegador, así que en los equipos compartidos del aula de informática los estudiantes deben llevarse su trabajo como archivo o como enlace. Los detalles están en [Qué se guarda en tu navegador](/es/essentials/units-settings#what-is-stored-in-your-browser).

## En apuntes y ejercicios {#in-lecture-notes-and-assignments}

Un enlace para compartir contiene el modelo completo, así que funciona en cualquier sitio donde funcione un enlace: un PDF, una diapositiva, una página del campus virtual, un correo.

::div{.steps}

### Prepara el modelo {#share-build}

Déjalo tal como quieres que tus estudiantes lo vean al abrirlo: con las cargas, las etiquetas y los diagramas que quieras mostrar.

### Copia el enlace {#share-copy}

Pulsa **Compartir modelo** en la barra superior. Activa **Mostrar lo que veo** si el enlace debe abrirse con tus diagramas, cargas y etiquetas activados, y pulsa **Copiar**.

### Pégalo en tus apuntes {#share-paste}

Quien lo abra obtiene su propia copia para explorarla. Nada de lo que cambie te llega a ti ni a nadie más. Los enlaces siguen funcionando de una versión de EduBeam a otra, así que los apuntes siguen siendo válidos año tras año.

::

Deja desactivado **Enlace más corto** en el material de la asignatura: una copia de EduBeam que no se haya actualizado desde que existe esa opción no puede abrir la forma corta hasta que se actualice.

| Enlace | Abre |
| --- | --- |
| `run.edubeam.app/?model=…` | el modelo, listo para editar |
| `run.edubeam.app/?viewer=1&model=…` | el modelo en [modo visor](/es/essentials/import-export#embed-a-read-only-viewer), para un `<iframe>` |
| `run.edubeam.app/?panel=examples` | la [galería de ejemplos](/es/examples/) |
| `run.edubeam.app/?lang=cs` | la aplicación en checo, o en cualquier [otro idioma](/es/essentials/import-export#url-parameters) |

::callout{type="warning" title="Un enlace reemplaza el modelo del estudiante"}
Al abrir un enlace, y en algunos navegadores una página con un visor incrustado, el modelo que tenía el estudiante pasa a **☰ → Estructuras recientes**, desde donde se puede restaurar. Aun así, pide a tus estudiantes que guarden el trabajo que les importe con **☰ → Guardar proyecto** antes de abrir enlaces de clase.
::

## Tareas que los estudiantes pueden comprobar por sí mismos {#assignments-students-can-check-themselves}

EduBeam permite a los estudiantes comprobar al momento su cálculo a mano, sin resolverles el problema.

- **Primero calcular, después comprobar.** Pide que calculen a mano las reacciones, los esfuerzos y un desplazamiento, y después que construyan el modelo y comparen. [Comprobar resultados a mano](/es/guide/verification) tiene las fórmulas, y el [Inicio rápido](/es/guide/quick-start#_8-check-by-hand) muestra la rutina.
- **Preguntar por qué difiere un resultado.** La deformación por cortante, una rótula olvidada, una carga en ejes locales en lugar de globales: cada una explica una diferencia pequeña o grande, y encontrarla enseña más que la coincidencia.
- **Recoger el modelo con el trabajo.** Pide un enlace para compartir o un `project.json` junto al cálculo. Puedes abrirlo y ver exactamente qué se ha modelado.
- **Informes con buen aspecto.** Los estudiantes pueden exportar el dibujo en **SVG**, que se mantiene nítido en Word y LaTeX, y los resultados en **CSV**. Consulta [Exportar una imagen](/es/essentials/import-export#export-an-image).

## Ejercicios ya preparados {#ready-made-exercises}

- **[Ejemplos](/es/examples/):** seis modelos que se abren con un clic, cada uno con preguntas, qué observar y las soluciones.
- **[Problemas para practicar](/es/practice):** vigas, pórticos y celosías generados que comprueban las respuestas de los estudiantes, y un [generador de exámenes](/es/exam) que los imprime como exámenes. Consulta el [apartado siguiente](#practice-and-test-papers).
- **[Tutoriales](/es/tutorials/inclined-beam):** una viga inclinada, un pórtico triarticulado, una celosía plana y una viga continua con asiento de apoyo, cada uno modelado paso a paso y comprobado a mano. Sirven como guiones de clase práctica de 15 a 20 minutos.
- **[Comprobar resultados a mano](/es/guide/verification):** los casos con solución analítica, desde un voladizo hasta un asiento de apoyo, para proponerlos como comprobaciones rápidas.

## Problemas para practicar y exámenes {#practice-and-test-papers}

Dos páginas de este sitio te preparan problemas de estática, sin nada que instalar ni programar:

- **[Problemas para practicar](/es/practice)** da a los estudiantes un problema nuevo cada vez que lo piden. Lo resuelven en papel, escriben las reacciones y el momento flector máximo o el esfuerzo en una barra, y la página comprueba cada valor con la solución exacta: se acepta un error de hasta el 1 %, y se avisa cuando el valor es correcto pero el sentido no. Una pista indica cómo empezar, y los diagramas aparecen al terminar. Cada problema tiene un código, por ejemplo `H2048`, que siempre corresponde al mismo problema: ponlo en una tarea y todos comprobarán con los mismos números.
- **El [generador de exámenes](/es/exam)** imprime exámenes: elige los tipos de estructura, hasta 6 problemas por examen y hasta 40 versiones, y cada estudiante recibe una versión distinta. Todas las versiones tienen los mismos tipos de estructura en el mismo orden, así que la dificultad es la misma. Añade una línea para el nombre, espacio para los cálculos y la hoja de soluciones, y **Imprimir o guardar como PDF** los imprime. **Descargar .zip** entrega cada figura como archivo SVG para LaTeX y Word, y las soluciones como tabla CSV para la corrección.

Ambas páginas ofrecen los mismos ocho tipos de estructura: seis isostáticas (una viga biapoyada, un voladizo, una viga biapoyada con voladizo, una viga Gerber, un pórtico triarticulado y una celosía Warren) y dos hiperestáticas (una viga continua de dos vanos y un pórtico).

El generador de exámenes guarda su configuración, incluido el **Número de examen**, que determina los valores numéricos, en la dirección de la página. Guárdala en favoritos y el año que viene obtendrás los mismos exámenes y las mismas soluciones. Los códigos de problema están desactivados por defecto en los exámenes: la página de problemas para practicar muestra la solución, así que los códigos tienen sentido en las tareas, donde los estudiantes comprueban su propio trabajo después.

## Hojas de ejercicios, exámenes y diapositivas desde código {#exercise-sheets-tests-and-slides-from-code}

Los diagramas de este sitio los dibuja [@edubeam/plot](/es/plot), una biblioteca de componentes de Vue que dibuja cualquier viga, pórtico o celosía plana resuelta con [@edubeam/fem](/es/solver), el solver de EduBeam. Si sabes algo de JavaScript, con ella unas pocas líneas de código se convierten en material para tu asignatura:

- **Tus propios tipos de problema.** Si las estructuras del generador de exámenes no son las que enseñas, escribe las tuyas: una semilla (el valor inicial del generador aleatorio) elige la estructura y sus valores, de modo que la misma semilla da siempre el mismo ejercicio, y la hoja de soluciones sale de esa misma semilla.
- **Diapositivas que se construyen por pasos.** Muestra la estructura, luego los apoyos y las cargas, luego las reacciones y luego el diagrama de momentos flectores, paso a paso, sin que el dibujo se mueva entre un paso y otro.
- **Figuras para apuntes y páginas de la asignatura.** SVG nítido que sigue el tema claro u oscuro de la página y que, a diferencia de una aplicación incrustada, nunca toca el modelo del estudiante.

Pruébalo. Cada vez que pulsas **Nuevo ejercicio** aparece un problema nuevo con su hoja de soluciones:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Ejercicios y exámenes" icon="lucide:file-check" to="/es/plot/exercises"}
Genera hojas de ejercicios y sus soluciones a partir de una semilla.
:::
:::card{title="Diapositivas y apuntes" icon="lucide:presentation" to="/es/plot/slides"}
Figuras que se construyen capa a capa, para diapositivas y apuntes.
:::
::
