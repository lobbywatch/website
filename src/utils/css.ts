import { css, cssFor, CSSProperties } from 'glamor'

const getCssText = (selector: string, close: string, styles: CSSProperties) => {
  const className = css(styles).toString()
  const mediaCss = cssFor(styles)
  const expectedSelector = `.${className},[data-${className}]{`
  const actualSelector = mediaCss.slice(0, expectedSelector.length)
  if (actualSelector !== expectedSelector) {
    throw new Error(
      `Expected glamor selector «${expectedSelector}» got «${actualSelector}»\nCSS:\n${mediaCss}`,
    )
  }
  return selector + mediaCss.replace(expectedSelector, '') + close
}

export const globalWithMediaQueries = (
  selector: string,
  styles: CSSProperties,
) => {
  const plainStyles: CSSProperties = {}
  for (const key of Object.keys(styles)) {
    if (key.indexOf('@media') === 0) {
      css.insert(getCssText(`${key}{${selector}{`, '}', styles[key]))
    } else if (key === ':hover') {
      css.insert(getCssText(`${selector}${key}{`, '', styles[key]))
    } else {
      plainStyles[key] = styles[key]
    }
  }
  css.global(selector, plainStyles)
}
