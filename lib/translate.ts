import { ReactNode } from 'react'
import { Locale } from './types'

export interface Translation {
  key: string
  value: string
}

export type Replacements = Record<string, number | string>

export type FormatterFunction = (
  key: string,
  replacements?: Replacements,
  missingValue?: string | null,
) => string

type FirstFunction = (
  keys: Array<string>,
  replacements?: Replacements,
  missingValue?: string | null,
) => string

type PluralizeFunction = (
  baseKey: string,
  replacements?: Replacements,
  missingValue?: string,
) => string

type ElementsFunction = (
  key: string,
  replacements?: Replacements,
  missingValue?: string,
) => ReactNode

type FirstElementsFunction = (
  key: string | Array<string>,
  replacements?: Replacements,
  missingValue?: string,
) => ReactNode

export type Formatter = FormatterFunction & {
  elements: ElementsFunction
  first: FirstFunction & { elements?: FirstElementsFunction }
  pluralize: PluralizeFunction & { elements?: ElementsFunction }
  locale: Locale
}

const replaceKeys = (message: string, replacements: Replacements) => {
  let withReplacements = message
  Object.keys(replacements).forEach((replacementKey) => {
    withReplacements = withReplacements.replace(
      `{${replacementKey}}`,
      String(replacements[replacementKey]),
    )
  })
  return withReplacements
}

const createPlaceholderFormatter = (
  locale: Locale,
  placeholder = '',
): Formatter => {
  const formatter = () => placeholder
  formatter.locale = locale
  formatter.elements = () => [placeholder]
  formatter.first = formatter
  formatter.first.elements = formatter.elements
  formatter.pluralize = formatter
  formatter.pluralize.elements = formatter.elements
  return formatter
}

export const createFormatter = (
  translations: Array<Translation>,
  locale: Locale,
): Formatter => {
  if (!translations) {
    return createPlaceholderFormatter(locale)
  }
  const index = translations.reduce(
    (accumulator, { key, value }) => ({ ...accumulator, [key]: value }),
    {} as Record<string, string>,
  )

  const formatter = <Formatter>function (key, replacements, missingValue) {
    let message =
      index[key] || (missingValue != null ? missingValue : `TK(${key})`)
    if (replacements) {
      message = replaceKeys(message, replacements)
    }
    return message
  }

  formatter.locale = locale

  const firstKey = (keys: Array<string>) =>
    keys.find((k) => index[k] !== undefined) || keys[keys.length - 1]
  const pluralizationKeys = (baseKey: string, replacements?: Replacements) => [
    // FIXME Not sure what is expected here and where `count` is coming from
    `${baseKey}/${replacements?.count ?? ''}`,
    `${baseKey}/other`,
  ]

  formatter.first = (keys, replacements, missingValue) => {
    return formatter(firstKey(keys), replacements, missingValue ?? undefined)
  }
  formatter.pluralize = (baseKey, replacements, missingValue) => {
    return formatter.first(
      pluralizationKeys(baseKey, replacements),
      replacements,
      missingValue,
    )
  }

  formatter.elements = (key, replacements, missingValue) => {
    return formatter(key, undefined, missingValue)
      .split(/(\{[^{}]+\})/g)
      .filter(Boolean)
      .reduce((r, part) => {
        if (part[0] === '{') {
          r.push(
            replacements != null ? String(replacements[part.slice(1, -1)]) : '',
          )
        } else {
          r.push(part)
        }
        return r
      }, new Array<string>())
  }

  const firstElements: FirstElementsFunction = (
    keys,
    replacements,
    missingValue,
  ) =>
    formatter.elements(
      firstKey(Array.isArray(keys) ? keys : [keys]),
      replacements,
      missingValue,
    )

  formatter.first.elements = firstElements

  formatter.pluralize.elements = (baseKey, replacements, missingValue) => {
    return firstElements(
      pluralizationKeys(baseKey, replacements),
      replacements,
      missingValue,
    )
  }

  return formatter
}
