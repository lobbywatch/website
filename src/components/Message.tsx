import React from 'react'

import type { Replacements, Translation } from '../utils/translate'
import { createFormatter } from '../utils/translate'

import translationsJson from '../assets/translations.json'
import { Locale } from '../domain'
import { useSafeRouter } from '../vendor/next'
import { Schema } from 'effect'

type TranslationsCache = Record<Locale, Array<Translation>>

const translations: TranslationsCache = {
  de: [],
  fr: [],
}

const getTranslations = (locale: Locale) => {
  if (translations[locale].length === 0) {
    translations[locale] = translationsJson.data.reduce((acc, translation) => {
      const value = translation[locale]
      const key = translation.key
      if (value != null) {
        acc.push({ key, value })
      }
      return acc
    }, new Array<Translation>())
  }

  return translations[locale]
}

export const translator = (locale: Locale) => {
  return createFormatter(getTranslations(locale), locale)
}

export const useT = (locale: Locale) => {
  const { query } = useSafeRouter(
    Schema.Struct({
      locale: Schema.optionalWith(Locale, { default: () => 'de' }),
    }),
  )
  const translations = getTranslations(query.locale)
  return createFormatter(translations, locale)
}

export interface TranslateProps {
  id: string
  locale: Locale
  replacements?: Replacements
  raw?: boolean
}

const Translate = ({ id, replacements, raw, locale }: TranslateProps) => {
  const t = useT(locale)
  const translation = t(id, replacements, null)
  return raw ? (
    <span dangerouslySetInnerHTML={{ __html: translation }} />
  ) : (
    <>{translation}</>
  )
}

export default Translate
