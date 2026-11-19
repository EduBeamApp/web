import { familyText, type FamilyId, type Problem, type Text } from '~/lib/problems'
import { renderStatement, renderText, type TextLanguage } from '~/lib/problem-text'

/**
 * The generated problems' words (`problems.*`) in the page's language, or in English where that
 * language has no problem text yet: a problem is never half in one language, and its numbers are
 * written as its words' language writes them. `locale` is that language, for the answers' numbers.
 */
export const useProblemText = () => {
  const { t, te, locale: pageLocale } = useI18n()
  const locale = computed(() => (te('problems.task.beam', pageLocale.value) ? pageLocale.value : 'en'))
  const language = computed<TextLanguage>(() => ({
    locale: locale.value,
    t: (key, params, count) => t(key, params, count === undefined ? { locale: locale.value } : { locale: locale.value, plural: count }),
  }))

  const text = (value: Text): string => renderText(value, language.value)
  const statement = (problem: Problem): string => renderStatement(problem, language.value)
  const family = (id: FamilyId, field: 'name' | 'skill' | 'hint' = 'name'): string => text(familyText(id, field))

  return { locale, text, statement, family }
}
