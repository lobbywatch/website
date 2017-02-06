const DataLoader = require('dataloader')
const gsheets = require('gsheets')
const lru = require('lru-cache')

const createDataLoaderLruCache = (options) => {
  const cache = lru(options)

  return {
    get: (k) => cache.get(k),
    set: (k, v) => cache.set(k, v),
    delete: (k) => cache.del(k),
    clear: () => cache.reset()
  }
}

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

const cachedTranslations = new DataLoader(loadTranslations, {
  cacheMap: createDataLoaderLruCache({
    max: 10,
    maxAge: 1000 * 30 // ms
  })
})

module.exports = () => {
  return {
    translations: cachedTranslations
  }
}
