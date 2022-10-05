export const fontFamilies = {
  serifTitle: 'Roboto Serif, serif',
  serifRegular: 'Roboto Serif, serif',
  serifItalic: 'Roboto Serif, serif',
  serifBold: 'Roboto Serif, serif',
  serifBoldItalic: 'Roboto Serif, serif',
  sansSerifRegular: 'Roboto, sans-serif',
  sansSerifItalic: 'Roboto, sans-serif',
  sansSerifMedium: 'Roboto, sans-serif',
  monospaceRegular: 'Menlo, Courier, monospace',
  cursiveTitle: 'sans-serif',
}

export const fontStyles = {
  serifTitle: {
    fontFamily: fontFamilies.serifTitle,
    fontWeight: 700,
  },
  serifRegular: {
    fontFamily: fontFamilies.serifRegular,
  },
  serifItalic: {
    fontFamily: fontFamilies.serifItalic,
    fontStyle: 'italic',
  },
  serifBold: {
    fontFamily: fontFamilies.serifBold,
    fontWeight: 700,
  },
  serifBoldItalic: {
    fontFamily: fontFamilies.serifBoldItalic,
    fontWeight: 700,
    fontStyle: 'italic',
  },
  sansSerifRegular: {
    fontFamily: fontFamilies.sansSerifRegular,
  },
  sansSerifItalic: {
    fontFamily: fontFamilies.sansSerifItalic,
    fontStyle: 'italic',
  },
  sansSerifMedium: {
    fontFamily: fontFamilies.sansSerifMedium,
    fontWeight: 500,
  },
  monospaceRegular: {
    fontFamily: fontFamilies.monospaceRegular,
  },
  cursiveTitle: {
    fontFamily: fontFamilies.cursiveTitle,
    fontWeight: 500,
    fontStyle: 'italic',
  },
}

export const fontFaces = () =>
  `
@font-face{
  font-family:Roboto;
  font-style:normal;
  font-weight:300;
  src:url(/static/fonts/roboto-v30-latin-300.woff2) format('woff2'),url(/static/fonts/roboto-v30-latin-300.woff) format('woff');
  font-display:swap
}
@font-face{
  font-family:Roboto;
  font-style:normal;
  font-weight:400;
  src:url(/static/fonts/roboto-v30-latin-regular.woff2) format('woff2'),url(/static/fonts/roboto-v30-latin-regular.woff) format('woff');
  font-display:swap
}
@font-face{
  font-family:Roboto;
  font-style:italic;
  font-weight:400;
  src:url(/static/fonts/roboto-v30-latin-italic.woff2) format('woff2'),url(/static/fonts/roboto-v30-latin-italic.woff) format('woff');
  font-display:swap
}
@font-face{
  font-family:Roboto;
  font-style:normal;
  font-weight:500;
  src:url(/static/fonts/roboto-v30-latin-500.woff2) format('woff2'),url(/static/fonts/roboto-v30-latin-500.woff) format('woff');
  font-display:swap
}
@font-face{
  font-family:Roboto;
  font-style:normal;
  font-weight:700;
  src:url(/static/fonts/roboto-v30-latin-700.woff2) format('woff2'),url(/static/fonts/roboto-v30-latin-700.woff) format('woff');
  font-display:swap
}


@font-face {
  font-family:'Roboto Serif';
  font-style:normal;
  font-weight:400;
  src:url('/static/fonts/roboto-serif-v8-latin-regular.woff2') format('woff2'),url('/static/fonts/roboto-serif-v8-latin-regular.woff') format('woff');
  font-display:swap
}
@font-face {
  font-family:'Roboto Serif';
  font-style:normal;
  font-weight:700;
  src:url('/static/fonts/roboto-serif-v8-latin-700.woff2') format('woff2'),url('/static/fonts/roboto-serif-v8-latin-700.woff') format('woff');
  font-display:swap
}
@font-face {
  font-family:'Roboto Serif';
  font-style:italic;
  font-weight:400;
  src:url('/static/fonts/roboto-serif-v8-latin-italic.woff2') format('woff2'),url('/static/fonts/roboto-serif-v8-latin-italic.woff') format('woff');
  font-display:swap
}
@font-face {
  font-family: 'Roboto Serif';
  font-style: italic;
  font-weight: 700;
  src:url('/static/fonts/roboto-serif-v8-latin-700italic.woff2') format('woff2'),url('/static/fonts/roboto-serif-v8-latin-700italic.woff') format('woff');
  font-display:swap
}
`
    .trim()
    .replaceAll('\n  ', '')
    .replaceAll('\n', '')
