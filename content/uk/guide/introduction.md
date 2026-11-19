---
description: "Що таке EduBeam: безкоштовний розв’язувач МСЕ у браузері для плоских балок, рам і ферм. Що він уміє і чого ні, для кого призначений, як влаштовано посібник і на яких відкритих бібліотеках побудований."
source: site
---

# Вступ

[EduBeam]{.edubeam} — це безкоштовний застосунок для розрахунку **балок, рам і ферм**, який працює просто в браузері. Ви креслите конструкцію, задаєте опори й навантаження, а розв’язувач на основі методу скінченних елементів перераховує епюри, реакції та прогини після кожної вашої зміни. Кнопки *Розрахувати* немає, нічого не треба встановлювати, і обліковий запис не потрібен.

::div{.actions}
[Запустити EduBeam ↗](https://run.edubeam.app/?lang=uk){target="_blank"} [Швидкий старт за 10 хвилин](/uk/guide/quick-start)
::

![Тришарнірна рама в EduBeam: навантаження помаранчеві, реакції фіолетові, згинальний момент червоний, деформована схема сіра](/screenshots/uk/hero.webp)

:span{#your-first-visit}

## Що вміє EduBeam {#what-it-does}

::card-grid{cols="2"}
:::card{title="Конструкції" icon="lucide:triangle" to="/uk/essentials/elements"}
Балки, нерозрізні балки, рами та ферми в площині x–z, складені з балкових елементів Тимошенка. Кінцеві шарніри перетворюють елемент на стрижень ферми.
:::
:::card{title="Опори" icon="lucide:anchor" to="/uk/essentials/nodes-supports#supports"}
Шарнірно-нерухома й шарнірно-рухома опора, защемлення, ковзне защемлення або будь-яке поєднання закріплених `Dx`, `Dz` і `Ry` — усе вибирається за умовним позначенням. Похилі опори та осідання опор.
:::
:::card{title="Навантаження" icon="lucide:arrow-down-to-line" to="/uk/essentials/loads"}
Сили й моменти у вузлах і в будь-якому місці стрижня, рівномірно розподілені та трапецієподібні навантаження, температурне навантаження й задані переміщення.
:::
:::card{title="Перерізи" icon="lucide:shapes" to="/uk/essentials/elements#cross-sections"}
Європейські та американські бібліотеки або будь-який накреслений багатокутник. Застосунок обчислить $A$, $I_y$, $I_z$, $I_{yz}$, головні осі й радіуси інерції.
:::
:::card{title="Результати" icon="lucide:chart-spline" to="/uk/essentials/results"}
Епюри **N**, **V** і **M**, деформована схема, реакції, переміщення вузлів, кінцеві зусилля й матриці жорсткості елементів.
:::
:::card{title="Розрахунок" icon="lucide:calculator" to="/uk/elements/analysis"}
Лінійна статика, точна для лінійної моделі: сітку згущувати не потрібно. Якщо конструкція геометрично змінювана (механізм), EduBeam пояснить чому й покаже анімацію її руху.
:::
:::card{title="Файли" icon="lucide:folder-open" to="/uk/essentials/import-export"}
Проєкти у форматі JSON, цілі моделі у вигляді посилань, креслення в PNG чи SVG, результати в CSV. Замінені моделі не губляться, і жодні дані не залишають вашого пристрою.
:::
:::card{title="Одиниці" icon="lucide:ruler" to="/uk/essentials/units-settings"}
Одиниці СІ або американські вмикаються одним клацанням, а можна налаштувати й кожну величину окремо. Вісь z униз або, як у підручниках, вісь y угору.
:::
::

## Чого EduBeam (поки що) не вміє {#what-it-does-not-do-yet}

Якщо знати обмеження наперед, можна заощадити час:

::div{.limits}
- **Лише 2D.** Без роботи конструкції з площини й без просторових рам.
- **Лише лінійна статика.** Без ефектів другого порядку (P–Δ), розрахунку на стійкість, динаміки та пластичності.
- **Один випадок навантаження.** Немає комбінацій навантажень і обвідних епюр: кожен випадок збережіть в окремому файлі або посиланні.
- **Без власної ваги.** Задайте її як розподілене навантаження.
- **Без перевірок за нормами.** EduBeam обчислює внутрішні зусилля й переміщення; перевірки за нормами лишаються за вами.
::

Якщо вам бракує якоїсь функції, [створіть issue на GitHub](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Для кого EduBeam {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Студенти" icon="lucide:graduation-cap" to="/uk/practice"}
Миттєва перевірка ручних розрахунків і задачі, які перевіряють кожну вашу відповідь одразу.
:::
:::card{title="Викладачі" icon="lucide:presentation" to="/uk/guide/teaching"}
Показуйте наживо на проєкторі, як опори, шарніри й навантаження змінюють зусилля, будь-якою з 18 мов, і друкуйте для кожного студента свій варіант контрольної.
:::
:::card{title="Інженери" icon="lucide:hard-hat" to="/uk/elements/analysis"}
Швидка перевірка на правдоподібність, перш ніж відкривати громіздкий настільний програмний комплекс. Кожен крок розрахунку задокументовано.
:::
:::card{title="Розробники" icon="lucide:code-xml" to="#libraries"}
Розв’язувач і креслення, на яких побудовано EduBeam, у вигляді бібліотек з відкритим кодом для ваших власних програм.
:::
::

## Як знайти потрібне в посібнику {#how-this-guide-is-organised}

На бічній панелі сторінки згруповано так, як показано нижче. Кнопки **?** у застосунку відкривають відповідну сторінку цього посібника вашою мовою.

::card-grid{cols="2"}
:::card{title="Початок роботи" icon="lucide:flag" to="/uk/guide/quick-start"}
Ця сторінка та швидкий старт: перша балка за десять хвилин.
:::
:::card{title="Створення моделі" icon="lucide:pencil-ruler" to="/uk/essentials/user-interface"}
Інтерфейс, вузли та опори, елементи, матеріали й перерізи, навантаження, одиниці та налаштування.
:::
:::card{title="Результати" icon="lucide:chart-spline" to="/uk/essentials/results"}
Епюри й таблиці результатів і те, як перевірити їх вручну.
:::
:::card{title="Обмін і викладання" icon="lucide:share-2" to="/uk/essentials/import-export"}
Файли проєктів, посилання на моделі, експорт зображень і CSV, викладання з EduBeam.
:::
:::card{title="Покрокові приклади" icon="lucide:triangle" to="/uk/tutorials/inclined-beam"}
Похила балка, тришарнірна рама, плоска ферма й нерозрізна балка з осіданням опори, кожна побудована крок за кроком і перевірена вручну.
:::
:::card{title="Приклади" icon="lucide:library" to="/uk/examples/"}
Шість готових моделей, які відкриваються одним клацанням, із вправами та відповідями.
:::
:::card{title="Теоретичний посібник" icon="lucide:sigma" to="/uk/elements/conventions"}
Осі та правила знаків, балковий елемент і елемент ферми, а також те, як EduBeam розраховує модель.
:::
:::card{title="Довідка" icon="lucide:life-buoy" to="/uk/reference/shortcuts"}
Клавіатура, миша та сенсорний екран, усунення несправностей і часті запитання.
:::
::

## Створюйте власні інструменти {#libraries}

EduBeam побудовано на двох бібліотеках з відкритим кодом, документацію до яких ви знайдете на цьому сайті. З ними можна розраховувати конструкції у скрипті, генерувати для кожного студента свою вправу або малювати рисунки для слайдів і конспектів.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/uk/solver"}
Розв’язувач МСЕ, на якому працює EduBeam, написаний на TypeScript: задати балку, розрахувати її й прочитати результати можна приблизно в десятку рядків, у браузері чи в Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/uk/plot"}
Компоненти Vue 3, які малюють розраховану конструкцію у SVG разом із навантаженнями, реакціями та епюрами N, V і M.
:::
::

## Мови {#languages}

EduBeam доступний 18 мовами й запускається мовою вашого браузера. Змінити мову можна в розділі **Налаштування → Мова та локаль** або вибрати її тут:

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

Мову може вибрати за читача й саме посилання: `run.edubeam.app/?lang=uk` відкриває застосунок українською.

## Автори та подяки {#authors-credits}

[EduBeam]{.edubeam} розробляє [Jan Voříšek](https://github.com/janvorisek) як незалежний проєкт. Застосунок продовжує справу настільної програми EduBeam для Windows і Linux, яку створили [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) та [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) на кафедрі механіки [будівельного факультету Чеського технічного університету у Празі (ČVUT)](https://www.fsv.cvut.cz/en), і досі відкриває збережені в ній сеанси. Його розв’язувач, [@edubeam/fem](/uk/solver), виріс із першої версії, яку написав Bořek Patzák. І застосунок, і розв’язувач — програми з відкритим кодом під ліцензією GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Головний розробник і продуктовий дизайнер","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Розробник: сенсорне керування, швидкодія відображення, навантаження та опори","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"Оригінальний EduBeam і перший розв’язувач МСЕ","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Долучайтеся {#contribute}

::card-grid{cols="3"}
:::card{title="Повідомити про проблему" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Щось незрозуміле, неправильне чи не працює? Звернення (issue) на GitHub потрапить просто до команди.
:::
:::card{title="Покращити переклад" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Тексти застосунку зберігаються в окремому файлі для кожної мови; ми радо приймемо pull request.
:::
:::card{title="Розкажіть іншим" icon="lucide:share-2"}
Порекомендуйте EduBeam одногрупникам і колегам або вставте посилання на модель у свій конспект.
:::
::
