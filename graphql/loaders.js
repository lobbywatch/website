const fs = require('fs')
const path = require('path')
const DataLoader = require('dataloader')
const gsheets = require('gsheets')
const LRU = require('lru-cache')
const {loadSearch} = require('./search')
const api = require('./api')

const createDataLoaderLruCache = (options) => {
  const cache = new LRU(options)

  return {
    get: (k) => cache.get(k),
    set: (k, v) => cache.set(k, v),
    delete: (k) => cache.del(k),
    clear: () => cache.reset()
  }
}

const LOCAL_TRANSLATION_PATH = path.join('..', 'lib', 'translations.json')
const HAS_LOCAL_TRANSLATIONS = fs.existsSync(
  path.join(__dirname, LOCAL_TRANSLATION_PATH)
)

const mapTranslations = (locales, data) => {
  return locales.map(locale => {
    const translations = data.map(translation => ({
      key: translation.key,
      value: translation[locale]
    }))
    translations.locale = locale
    return translations
  })
}

const loadTranslations = HAS_LOCAL_TRANSLATIONS
? (locales) => {
  const json = require(LOCAL_TRANSLATION_PATH)
  return Promise.resolve(
    mapTranslations(locales, json.data)
  )
}
: (locales) => {
  const start = new Date().getTime()
  return gsheets.getWorksheetById('1FhjogYL2SBxaJG3RfR01A7lWtb3XTE2dH8EtYdmdWXg', 'od6')
    .then(res => {
      const end = new Date().getTime()
      console.info('[gsheets]', '1FhjogYL2SBxaJG3RfR01A7lWtb3XTE2dH8EtYdmdWXg', 'od6')
      console.info(`${end - start}ms`)
      return mapTranslations(locales, res.data)
    })
}

const cachedTranslations = new DataLoader(loadTranslations, {
  cacheMap: createDataLoaderLruCache({
    max: 2,
    maxAge: 30 * 1000 // ms
  })
})

const cachedSearch = new DataLoader(loadSearch, {
  cacheMap: createDataLoaderLruCache({
    max: 2,
    maxAge: 5 * 60 * 1000 // ms
  })
})

const loadMeta = (locales) => {
  return Promise.all(
    locales.map(locale => api.drupal(locale, 'daten/meta').then(({json}) => json))
  )
}

const cachedMeta = new DataLoader(loadMeta, {
  cacheMap: createDataLoaderLruCache({
    max: 2,
    maxAge: 5 * 60 * 1000 // ms
  })
})

module.exports = () => {
  return {
    translations: cachedTranslations,
    search: cachedSearch,
    meta: cachedMeta
  }
}
