// exports instead of named export for graphql server

exports.getFormatter = translations => {
  if (!Array.isArray(translations)) {
    return () => ''
  }

  const index = translations.reduce((accumulator, translation) => {
    accumulator[translation.key] = translation.value
    return accumulator
  }, {})
  return (key, replacements, emptyValue) => {
    let message = index[key] || (emptyValue !== undefined ? emptyValue : `[missing translation '${key}']`)
    if (replacements) {
      Object.keys(replacements).forEach(replacementKey => {
        message = message.replace(`{${replacementKey}}`, replacements[replacementKey])
      })
    }
    return message
  }
}
