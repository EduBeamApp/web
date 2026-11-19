---
description: "Что такое EduBeam: бесплатный МКЭ-расчёт плоских балок, рам и ферм в браузере. Возможности и ограничения, для кого он, устройство руководства и библиотеки."
source: site
---

# Введение

[EduBeam]{.edubeam} — бесплатное приложение для расчёта **балок, рам и ферм**, которое работает прямо в браузере. Вы рисуете конструкцию, задаёте опоры и нагрузки, а решатель по методу конечных элементов пересчитывает эпюры, опорные реакции и прогибы при каждом вашем изменении. Кнопки *Рассчитать* здесь нет, а устанавливать программу и заводить учётную запись не нужно.

::div{.actions}
[Запустить EduBeam ↗](https://run.edubeam.app/?lang=ru){target="_blank"} [Быстрый старт за 10 минут](/ru/guide/quick-start)
::

![Трёхшарнирная рама в EduBeam: нагрузки оранжевым, реакции фиолетовым, изгибающий момент красным, деформированная схема серым](/screenshots/ru/hero.webp)

:span{#your-first-visit}

## Что умеет EduBeam {#what-it-does}

::card-grid{cols="2"}
:::card{title="Конструкции" icon="lucide:triangle" to="/ru/essentials/elements"}
Балки, неразрезные балки, рамы и фермы в плоскости x–z, собранные из балочных элементов Тимошенко. Концевые шарниры превращают элемент в стержень фермы.
:::
:::card{title="Опоры" icon="lucide:anchor" to="/ru/essentials/nodes-supports#supports"}
Шарнирно-неподвижная и шарнирно-подвижная опора, жёсткая и скользящая заделка или любое сочетание закреплённых `Dx`, `Dz` и `Ry`; нужную опору выбирают по условному обозначению. Наклонные опоры и осадки опор.
:::
:::card{title="Нагрузки" icon="lucide:arrow-down-to-line" to="/ru/essentials/loads"}
Силы и моменты в узлах и в любой точке элемента, равномерно распределённые и трапециевидные нагрузки, температурные воздействия и заданные перемещения.
:::
:::card{title="Сечения" icon="lucide:shapes" to="/ru/essentials/elements#cross-sections"}
Европейский и американский сортаменты или любой нарисованный многоугольник; EduBeam вычисляет $A$, $I_y$, $I_z$, $I_{yz}$, главные оси и радиусы инерции.
:::
:::card{title="Результаты" icon="lucide:chart-spline" to="/ru/essentials/results"}
Эпюры **N**, **V** и **M**, деформированная схема, опорные реакции, перемещения узлов, концевые усилия и матрицы жёсткости элементов.
:::
:::card{title="Расчёт" icon="lucide:calculator" to="/ru/elements/analysis"}
Линейная статика, точная для линейной модели: сетку сгущать не нужно. Если система не может нести нагрузку, EduBeam объяснит почему и покажет анимацией, как она движется.
:::
:::card{title="Файлы" icon="lucide:folder-open" to="/ru/essentials/import-export"}
Проекты в JSON, целые модели в виде ссылок, чертежи в PNG или SVG, результаты в CSV. Заменённая модель не пропадает, а данные не покидают ваше устройство.
:::
:::card{title="Единицы" icon="lucide:ruler" to="/ru/essentials/units-settings"}
СИ или американская система одним щелчком либо отдельно для каждой величины. Ось z вниз или привычная по учебникам ось y вверх.
:::
::

## Чего EduBeam (пока) не умеет {#what-it-does-not-do-yet}

Если знать ограничения заранее, можно сэкономить время:

::div{.limits}
- **Только 2D.** Работа конструкции из плоскости не учитывается, пространственные рамы не рассчитываются.
- **Только линейная статика.** Нет расчёта по деформированной схеме (P–Δ), расчёта на устойчивость, динамики и пластичности.
- **Один случай нагружения.** Нет сочетаний нагрузок и огибающих: сохраняйте каждый случай в отдельный файл или отдельную ссылку.
- **Нет собственного веса.** Задайте его как распределённую нагрузку.
- **Нет проверок по нормам.** EduBeam вычисляет внутренние усилия и перемещения, а проверка по нормам остаётся за вами.
::

Если вам не хватает какой-то функции, [напишите о ней на GitHub](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Для кого EduBeam {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Студентам" icon="lucide:graduation-cap" to="/ru/practice"}
Мгновенная обратная связь при ручном расчёте и задачи, в которых каждый ответ проверяется сразу.
:::
:::card{title="Преподавателям" icon="lucide:presentation" to="/ru/guide/teaching"}
Показывайте вживую на проекторе, как опоры, шарниры и нагрузки меняют усилия, на любом из 18 языков, и печатайте для каждого студента свой вариант контрольной.
:::
:::card{title="Инженерам" icon="lucide:hard-hat" to="/ru/elements/analysis"}
Быстрая проверка перед тем, как открыть «тяжёлую» настольную программу; каждый шаг решения описан в документации.
:::
:::card{title="Разработчикам" icon="lucide:code-xml" to="#libraries"}
Решатель и отрисовка схем, на которых построен EduBeam, — в виде библиотек с открытым исходным кодом для ваших собственных программ.
:::
::

## Как устроено руководство {#how-this-guide-is-organised}

На боковой панели страницы сгруппированы так, как показано ниже. Кнопки **?** в приложении открывают соответствующую страницу этого руководства на вашем языке.

::card-grid{cols="2"}
:::card{title="Начало работы" icon="lucide:flag" to="/ru/guide/quick-start"}
Эта страница и «Быстрый старт»: первая балка за десять минут.
:::
:::card{title="Моделирование" icon="lucide:pencil-ruler" to="/ru/essentials/user-interface"}
Интерфейс, узлы и опоры, элементы, материалы и сечения, нагрузки, единицы и настройки.
:::
:::card{title="Результаты" icon="lucide:chart-spline" to="/ru/essentials/results"}
Эпюры и таблицы результатов и их проверка вручную.
:::
:::card{title="Обмен и преподавание" icon="lucide:share-2" to="/ru/essentials/import-export"}
Файлы проектов, ссылки на модели, экспорт изображений и CSV, преподавание с EduBeam.
:::
:::card{title="Учебные примеры" icon="lucide:triangle" to="/ru/tutorials/inclined-beam"}
Наклонная балка, трёхшарнирная рама, плоская ферма и неразрезная балка с осадкой опоры: каждая модель строится шаг за шагом и проверяется вручную.
:::
:::card{title="Примеры" icon="lucide:library" to="/ru/examples/"}
Шесть готовых моделей, которые открываются одним щелчком, с упражнениями и ответами.
:::
:::card{title="Теоретическое руководство" icon="lucide:sigma" to="/ru/elements/conventions"}
Оси и правила знаков, балочный элемент и элемент фермы, а также то, как EduBeam рассчитывает модель.
:::
:::card{title="Справка" icon="lucide:life-buoy" to="/ru/reference/shortcuts"}
Клавиатура, мышь и сенсорный экран, устранение неполадок и часто задаваемые вопросы.
:::
::

## Создавайте свои инструменты {#libraries}

EduBeam построен на двух библиотеках с открытым исходным кодом, документация к которым есть на этом сайте. С их помощью можно рассчитывать конструкции в скрипте, генерировать для каждого студента свой вариант задачи или рисовать иллюстрации для слайдов и конспектов.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/ru/solver"}
Конечно-элементный решатель EduBeam на TypeScript: задать балку, рассчитать её и прочитать результаты можно в десятке строк кода, в браузере или в Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/ru/plot"}
Компоненты Vue 3, которые рисуют рассчитанную конструкцию в SVG вместе с нагрузками, реакциями и эпюрами N, V и M.
:::
::

## Языки {#languages}

EduBeam доступен на 18 языках и запускается на языке вашего браузера. Сменить язык можно в разделе **Настройки → Язык и локаль** или прямо здесь:

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

Язык может выбрать и сама ссылка: `run.edubeam.app/?lang=ru` откроет приложение на русском.

## Авторы и благодарности {#authors-credits}

[EduBeam]{.edubeam} разрабатывает [Ян Воржишек (Jan Voříšek)](https://github.com/janvorisek) как независимый проект. Он продолжает традицию настольного EduBeam для Windows и Linux, который создали [Борек Пацак (Bořek Patzák)](http://ksm.fsv.cvut.cz/~bp/), [Ян Странский (Jan Stránský)](https://mech.fsv.cvut.cz/~stransky/en/) и [Вит Шмилауэр (Vít Šmilauer)](https://mech.fsv.cvut.cz/~smilauer/) на кафедре механики [строительного факультета Чешского технического университета в Праге (ЧВУТ)](https://www.fsv.cvut.cz/en), и по-прежнему открывает его файлы сеансов. Решатель [@edubeam/fem](/ru/solver) вырос из первой версии, написанной Бореком Пацаком. И приложение, и решатель распространяются с открытым исходным кодом по лицензии GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Ведущий разработчик и дизайнер продукта","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Разработчик: сенсорное управление, скорость отрисовки, нагрузки и опоры","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"Первоначальный EduBeam и первый решатель МКЭ","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Как помочь проекту {#contribute}

::card-grid{cols="3"}
:::card{title="Сообщить о проблеме" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Что-то непонятно, неверно или не работает? Сообщение о проблеме (issue) на GitHub попадёт прямо к команде.
:::
:::card{title="Улучшить перевод" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Тексты приложения хранятся в одном файле для каждого языка; мы будем рады вашему pull request.
:::
:::card{title="Рассказать другим" icon="lucide:share-2"}
Расскажите об EduBeam однокурсникам и коллегам или вставьте ссылку на модель в свой конспект.
:::
::
