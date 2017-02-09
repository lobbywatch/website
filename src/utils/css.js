import {css, cssFor} from 'glamor'

export const globalWithMediaQueries = (selector, styles) => {
  const plainStyles = {}
  Object.keys(styles).forEach(key => {
    if (key.indexOf('@media') === 0) {
      const mediaStyle = styles[key]
      const className = css(mediaStyle).toString()
      const mediaCss = cssFor(mediaStyle)
      const expectedSelector = `.${className},[data-${className}]{`
      const actualSelector = mediaCss.slice(0, expectedSelector.length)
      if (actualSelector !== expectedSelector) {
        throw new Error(`Expected glamor selector «${expectedSelector}» got «${actualSelector}»\nCSS:\n${mediaCss}`)
      }
      css.insert(
        `${key}{${selector}{` +
        mediaCss.replace(expectedSelector, '') +
        '}}'
      )
    } else {
      plainStyles[key] = styles[key]
    }
  })
  css.global(selector, plainStyles)
}
