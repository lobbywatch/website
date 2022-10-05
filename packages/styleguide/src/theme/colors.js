// some defaults are precomputed colors from d3-scale-chromatic
/*
 sequential = [
  d3.interpolateBlues(1),
  d3.interpolateBlues(0.95),
  d3.interpolateBlues(0.9),
  d3.interpolateBlues(0.85),
  d3.interpolateBlues(0.8),
  d3.interpolateBlues(0.75),
  d3.interpolateBlues(0.7),
  d3.interpolateBlues(0.65),
  d3.interpolateBlues(0.6),
  d3.interpolateBlues(0.55),
  d3.interpolateBlues(0.5)
 ],
 sequential3 = [d3.interpolateBlues(1), d3.interpolateBlues(0.8), d3.interpolateBlues(0.6)],
 opposite3 = [d3.interpolateReds(1), d3.interpolateReds(0.8), d3.interpolateReds(0.6)],
 discrete = d3.schemeCategory10
 */

const discrete = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
]

const colors = {
  light: {
    logo: '#74D7FF',
    default: '#fff',
    overlay: '#fff',
    hover: '#f2f2f2',
    alert: '#C7EFFF',
    error: '#b2182b',
    defaultInverted: '#000',
    overlayInverted: '#1F1F1F',
    divider: '#ddd',
    dividerInverted: '#4C4D4C',
    primary: '#0077D7',
    primaryHover: '#004C88',
    text: '#000',
    textInverted: '#fff',
    textSoft: '#666',
    textSoftInverted: '#A9A9A9',
    disabled: '#f2f2f2',
    overlayShadow: '0 0 15px rgba(0,0,0,0.1)',
    fadeOutGradientDefault:
      'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
    fadeOutGradientOverlay:
      'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
    displayLight: 'block',
    displayDark: 'none',
    sequential100: 'rgb(8, 48, 107)',
    sequential95: 'rgb(8, 61, 126)',
    sequential90: 'rgb(10, 74, 144)',
    sequential85: 'rgb(15, 87, 159)',
    sequential80: 'rgb(24, 100, 170)',
    sequential75: 'rgb(34, 113, 180)',
    sequential70: 'rgb(47, 126, 188)',
    sequential65: 'rgb(60, 139, 195)',
    sequential60: 'rgb(75, 151, 201)',
    sequential55: 'rgb(91, 163, 207)',
    sequential50: 'rgb(109, 174, 213)',
    opposite100: 'rgb(103,0,13)',
    opposite80: 'rgb(187,21,26)',
    opposite60: 'rgb(239,69,51)',
    neutral: '#bbb',
    discrete,
    chartsInverted: '#000000',
  },
  mappings: {},
}

// no dark mode
colors.dark = colors.light

export default colors
