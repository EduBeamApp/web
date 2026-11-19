/**
 * Czech counts in three forms, written `jeden | dva až čtyři | pět a více` in a message: 1 papír,
 * 2–4 papíry, 0 and 5+ papírů. A message with two forms (English, before it is translated) picks
 * between them as English does.
 */
const czechPlural = (choice: number, choicesLength: number): number => {
  const n = Math.abs(choice)
  if (choicesLength < 3) return n === 1 ? 0 : 1
  return n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2
}

/**
 * French counts zero with the singular, written `un | plusieurs` in a message: 0 exercice,
 * 1 exercice, 2 exercices. Below 2 is the first form, as CLDR's French rule (integer part 0 or 1).
 * Brazilian Portuguese counts the same way (CLDR `pt`: 0 exercício, 1 exercício, 2 exercícios).
 */
const frenchPlural = (choice: number, choicesLength: number): number => {
  if (choicesLength < 2) return 0
  return Math.abs(choice) < 2 ? 0 : 1
}

/**
 * Polish counts in three forms, written `jeden | dwa–cztery | pięć i więcej` in a message: 1 zadanie,
 * 2–4 and 22–24 zadania, but 0, 5–21 and 25+ zadań (12–14 included). This is CLDR's Polish rule for
 * whole numbers. A message with two forms (English, before it is translated) picks between them as
 * English does.
 */
const polishPlural = (choice: number, choicesLength: number): number => {
  const n = Math.abs(choice)
  if (choicesLength < 3) return n === 1 ? 0 : 1
  if (n === 1) return 0
  const units = n % 10
  const tens = n % 100
  return units >= 2 && units <= 4 && (tens < 12 || tens > 14) ? 1 : 2
}

/**
 * Russian counts in three forms, written `один | два–четыре | пять и больше` in a message: 1 и 21
 * задача, 2–4 и 22–24 задачи, но 0, 5–20 и 25–30 задач (11–14 тоже). This is CLDR's Russian rule
 * for whole numbers; unlike Polish, 21, 31… take the first form. A fraction takes the second form,
 * as Russian writes it (2,5 задачи). A message with two forms (English, before it is translated)
 * picks between them as English does.
 */
const russianPlural = (choice: number, choicesLength: number): number => {
  const n = Math.abs(choice)
  if (choicesLength < 3) return n === 1 ? 0 : 1
  if (!Number.isInteger(n)) return 1
  const units = n % 10
  const tens = n % 100
  if (units === 1 && tens !== 11) return 0
  return units >= 2 && units <= 4 && (tens < 12 || tens > 14) ? 1 : 2
}

/**
 * Text not yet translated shows in English. New copy is written in English first and translated
 * once it is settled.
 */
export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  pluralRules: { cs: czechPlural, fr: frenchPlural, pt: frenchPlural, pl: polishPlural, ru: russianPlural },
}))
