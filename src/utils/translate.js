// exports instead of named export for graphql server

module.exports.getFormatter = (translations) => {
  if (!Array.isArray(translations)) {
    return () => ''
  }

  const index = translations.reduce((accumulator, translation) => {
    accumulator[translation.key] = translation.value
    return accumulator
  }, {})

  const formatter = (key, replacements, missingValue) => {
    let message =
      index[key] || (missingValue !== undefined ? missingValue : `TK(${key})`)
    if (replacements) {
      for (const replacementKey of Object.keys(replacements)) {
        message = message.replace(
          `{${replacementKey}}`,
          replacements[replacementKey]
        )
      }
    }
    return message
  }

  formatter.locale = translations.locale

  const firstKey = (keys) =>
    keys.find((k) => index[k] !== undefined) || keys[keys.length - 1]
  const pluralizationKeys = (baseKey, replacements) => [
    `${baseKey}/${replacements.count}`,
    `${baseKey}/other`,
  ]

  formatter.first = (keys, replacements, missingValue) => {
    return formatter(firstKey(keys), replacements, missingValue)
  }
  formatter.pluralize = (baseKey, replacements, missingValue) => {
    return formatter.first(
      pluralizationKeys(baseKey, replacements),
      replacements,
      missingValue
    )
  }

  const createReplacementReducer = (replacements) => (r, part) => {
    if (part[0] === '{') {
      r.push(replacements[part.slice(1, -1)] || '')
    } else {
      r.push(part)
    }
    return r
  }
  formatter.elements = (key, replacements, missingValue) => {
    return formatter(key, undefined, missingValue)
      .split(/({[^{}]+})/g)
      .filter(Boolean)
      .reduce(createReplacementReducer(replacements), [])
  }
  formatter.first.elements = (keys, replacements, missingValue) => {
    return formatter.elements(firstKey(keys), replacements, missingValue)
  }
  formatter.pluralize.elements = (baseKey, replacements, missingValue) => {
    return formatter.first.elements(
      pluralizationKeys(baseKey, replacements),
      replacements,
      missingValue
    )
  }

  return formatter
}
