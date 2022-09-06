import React from 'react'
import { css } from 'glamor'

const PADDING = 20
const mediaColumns = '@media only screen and (min-width: 640px)'

const styles = {
  list: css({
    listStyle: 'none',
    margin: `15px -${PADDING}px`,
    padding: 0,
    display: 'flex',
    flexWrap: 'wrap',
  }),
  item: css({
    display: 'block',
    margin: '0 auto',
    padding: `0 ${PADDING}px`,
    width: '100%',
    [mediaColumns]: {
      width: '33%',
      textAlign: 'center',
    },
    '& > h3': {
      marginBottom: 5,
    },
    '& > p': {
      marginTop: 0,
    },
  }),
}

export const PurposeList = ({ children }) => {
  return <ul {...styles.list}>{children}</ul>
}

export const PurposeItem = ({ children }) => {
  return <li {...styles.item}>{children}</li>
}
