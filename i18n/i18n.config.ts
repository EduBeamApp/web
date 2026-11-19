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
 * Text not yet translated shows in English. New copy is written in English first and translated
 * once it is settled.
 */
export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  pluralRules: { cs: czechPlural },
}))
