const DataLoader = require('dataloader')
const gsheets = require('gsheets')

const loadTranslations = (locales) => {
  const start = new Date().getTime()
  return gsheets.getWorksheetById('1FhjogYL2SBxaJG3RfR01A7lWtb3XTE2dH8EtYdmdWXg', 'od6')
    .then(res => {
      const end = new Date().getTime()
      console.info('[gsheets]', '1FhjogYL2SBxaJG3RfR01A7lWtb3XTE2dH8EtYdmdWXg', 'od6')
      console.info(`${end - start}ms`)
      return locales.map(locale => {
        return res.data.map(translation => ({
          key: translation.key,
          value: translation[locale]
        }))
      })
    })
}

module.exports = () => {
  return {
    translations: new DataLoader(loadTranslations)
  }
}
