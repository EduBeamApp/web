---
description: "Qué es EduBeam, un solver MEF gratuito para vigas, pórticos y celosías 2D en el navegador: qué hace y qué no, para quién es, la guía y sus bibliotecas."
source: site
---

# Introducción

[EduBeam]{.edubeam} es una aplicación gratuita de análisis estructural para **vigas, pórticos y celosías** que funciona en el navegador. Dibujas la estructura, la apoyas y la cargas, y el solver de elementos finitos recalcula los diagramas, las reacciones y las flechas con cada cambio que haces. No hay botón *Calcular*, no hay nada que instalar y no hace falta crear una cuenta.

::div{.actions}
[Abrir EduBeam ↗](https://run.edubeam.app/?lang=es){target="_blank"} [Inicio rápido en 10 minutos](/es/guide/quick-start)
::

![Un pórtico triarticulado en EduBeam: cargas en naranja, reacciones en morado, momento flector en rojo y deformada en gris](/screenshots/es/hero.webp)

:span{#your-first-visit}

## Qué hace {#what-it-does}

::card-grid{cols="2"}
:::card{title="Estructuras" icon="lucide:triangle" to="/es/essentials/elements"}
Vigas, vigas continuas, pórticos y celosías en el plano x–z, formados por elementos viga de Timoshenko. Con rótulas en los extremos, un elemento se convierte en una barra de celosía.
:::
:::card{title="Apoyos" icon="lucide:anchor" to="/es/essentials/nodes-supports#supports"}
Articulación, rodillo, empotramiento, deslizadera o cualquier combinación de `Dx`, `Dz` y `Ry` restringidos, elegida por su símbolo. Apoyos inclinados y asientos de apoyo.
:::
:::card{title="Cargas" icon="lucide:arrow-down-to-line" to="/es/essentials/loads"}
Fuerzas y momentos en los nodos o en cualquier punto de una barra, cargas lineales uniformes y trapezoidales, cargas térmicas y desplazamientos impuestos.
:::
:::card{title="Secciones" icon="lucide:shapes" to="/es/essentials/elements#cross-sections"}
Bibliotecas europeas y estadounidenses, o cualquier polígono que dibujes, con $A$, $I_y$, $I_z$, $I_{yz}$, los ejes principales y los radios de giro ya calculados.
:::
:::card{title="Resultados" icon="lucide:chart-spline" to="/es/essentials/results"}
Diagramas de **N**, **V** y **M**, la deformada, las reacciones, los desplazamientos nodales, las fuerzas en los extremos y las matrices de rigidez de los elementos.
:::
:::card{title="Análisis" icon="lucide:calculator" to="/es/elements/analysis"}
Estática lineal, exacta para el modelo lineal: no hay malla que refinar. Si una estructura no se sostiene, EduBeam explica por qué y anima cómo se mueve.
:::
:::card{title="Archivos" icon="lucide:folder-open" to="/es/essentials/import-export"}
Proyectos en JSON, modelos completos como enlaces, dibujos en PNG o SVG y resultados en CSV. Los modelos reemplazados se conservan y nada sale de tu dispositivo.
:::
:::card{title="Unidades" icon="lucide:ruler" to="/es/essentials/units-settings"}
SI o unidades estadounidenses con un clic, o magnitud por magnitud. El eje z hacia abajo, o el eje y hacia arriba de los libros de texto.
:::
::

## Qué no hace (todavía) {#what-it-does-not-do-yet}

Conocer los límites de antemano ahorra tiempo:

::div{.limits}
- **Solo 2D.** Sin comportamiento fuera del plano, sin pórticos 3D.
- **Solo estática lineal.** Sin efectos de segundo orden (P–Δ), pandeo, dinámica ni plasticidad.
- **Un solo caso de carga.** Sin combinaciones ni envolventes: guarda cada caso en su propio archivo o enlace.
- **Sin peso propio.** Introdúcelo como carga lineal.
- **Sin dimensionamiento.** EduBeam da los esfuerzos y los desplazamientos; las comprobaciones según la normativa corren de tu cuenta.
::

Si echas en falta una función que te importa, [abre una incidencia](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## ¿Para quién es? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Estudiantes" icon="lucide:graduation-cap" to="/es/practice"}
Comprobación inmediata de tus cálculos a mano y problemas para practicar que corrigen tus resultados sobre la marcha.
:::
:::card{title="Docentes" icon="lucide:presentation" to="/es/guide/teaching"}
Muestra en directo con el proyector, en 22 idiomas, cómo los apoyos, las rótulas y las cargas cambian los esfuerzos, e imprime un examen distinto para cada estudiante.
:::
:::card{title="Ingenieros" icon="lucide:hard-hat" to="/es/elements/analysis"}
Una comprobación rápida antes de abrir un programa de escritorio más pesado, con cada paso de la solución documentado.
:::
:::card{title="Desarrolladores" icon="lucide:code-xml" to="#libraries"}
El solver y los dibujos de EduBeam, publicados como bibliotecas de código abierto para tu propio código.
:::
::

## Cómo moverte por la guía {#how-this-guide-is-organised}

La barra lateral agrupa las páginas así. Los botones **?** de la aplicación abren aquí la página correspondiente, en tu idioma.

::card-grid{cols="2"}
:::card{title="Primeros pasos" icon="lucide:flag" to="/es/guide/quick-start"}
Esta página y el Inicio rápido: una primera viga en diez minutos.
:::
:::card{title="Crear un modelo" icon="lucide:pencil-ruler" to="/es/essentials/user-interface"}
La interfaz, nodos y apoyos, elementos, materiales y secciones, cargas, unidades y ajustes.
:::
:::card{title="Leer los resultados" icon="lucide:chart-spline" to="/es/essentials/results"}
Los diagramas y las tablas de resultados, y cómo comprobarlos a mano.
:::
:::card{title="Compartir y enseñar" icon="lucide:share-2" to="/es/essentials/import-export"}
Archivos de proyecto, enlaces para compartir, exportación de imágenes y CSV, y la docencia con EduBeam.
:::
:::card{title="Tutoriales" icon="lucide:triangle" to="/es/tutorials/inclined-beam"}
Una viga inclinada, un pórtico triarticulado, una celosía plana y una viga continua con asiento de apoyo, cada uno construido paso a paso y comprobado a mano.
:::
:::card{title="Ejemplos" icon="lucide:library" to="/es/examples/"}
Seis modelos ya preparados que se abren con un clic, con ejercicios y soluciones.
:::
:::card{title="Manual teórico" icon="lucide:sigma" to="/es/elements/conventions"}
Ejes y convención de signos, los elementos viga y barra de celosía, y cómo resuelve EduBeam un modelo.
:::
:::card{title="Ayuda" icon="lucide:life-buoy" to="/es/reference/shortcuts"}
Teclado, ratón y pantalla táctil, solución de problemas y preguntas frecuentes.
:::
::

## Crea tus propias herramientas {#libraries}

EduBeam se apoya en dos bibliotecas de código abierto, documentadas en este mismo sitio. Con ellas puedes resolver estructuras desde un script, generar un ejercicio distinto para cada estudiante o dibujar figuras para diapositivas y apuntes.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/es/solver"}
El solver de elementos finitos de EduBeam, en TypeScript: define, resuelve y consulta una viga en una docena de líneas, en el navegador o en Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/es/plot"}
Componentes de Vue 3 que dibujan en SVG una estructura resuelta, con sus cargas, reacciones y diagramas de N, V y M.
:::
::

## Idiomas {#languages}

EduBeam habla 22 idiomas y arranca en el de tu navegador. Cámbialo en **Configuración → Idioma y configuración regional**, o elige uno aquí:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-hu"} Magyar](https://run.edubeam.app/?lang=hu){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-ro"} Română](https://run.edubeam.app/?lang=ro){target="_blank"}
- [:icon{name="circle-flags:lang-sk"} Slovenčina](https://run.edubeam.app/?lang=sk){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-el"} Ελληνικά](https://run.edubeam.app/?lang=el){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

Un enlace también puede fijar el idioma de antemano: `run.edubeam.app/?lang=es` se abre en español.

## Autores y agradecimientos {#authors-credits}

[EduBeam]{.edubeam} lo desarrolla [Jan Voříšek](https://github.com/janvorisek) como proyecto independiente. Sigue los pasos del EduBeam de escritorio para Windows y Linux, creado por [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) y [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) en el Departamento de Mecánica de la [Facultad de Ingeniería Civil de la Universidad Técnica Checa de Praga (ČVUT)](https://www.fsv.cvut.cz/en), y todavía abre sus archivos de sesión. Su solver, [@edubeam/fem](/es/solver), nació de la primera versión de Bořek Patzák. Tanto la aplicación como el solver son de código abierto, bajo licencia GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Desarrollador principal y diseñador del producto","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Desarrollador: control táctil, rendimiento del dibujo, cargas y apoyos","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"El EduBeam original y el primer solver MEF","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Contribuir {#contribute}

::card-grid{cols="3"}
:::card{title="Informar de un problema" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
¿Algo confuso, incorrecto o que no funciona? Una incidencia en GitHub llega directamente al equipo.
:::
:::card{title="Mejorar una traducción" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Los textos de la aplicación están en un archivo por idioma; los pull requests son bienvenidos.
:::
:::card{title="Darlo a conocer" icon="lucide:share-2"}
Comparte EduBeam con tus compañeros y colegas, o incluye el enlace de un modelo en tus apuntes.
:::
::
