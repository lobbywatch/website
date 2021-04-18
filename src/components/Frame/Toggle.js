import React from 'react'
import {css} from 'glamor'
import {LW_BLUE_LIGHT, mediaM} from '../../theme'

const toggleStyle = css({
  [mediaM]: {
    display: 'none'
  },
  width: 24,
  height: 24,
  padding: 3,
  position: 'absolute',
  top: 25,
  right: 20,
  cursor: 'pointer',
  zIndex: 1,
  '&, :hover, :focus': {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    outline: 'none'
  },
  '& span': {
    display: 'block',
    position: 'absolute',
    height: 2,
    backgroundColor: LW_BLUE_LIGHT,
    opacity: 1,
    left: 0,
    width: 24,
    transition: 'transform .25s ease-in-out, opacity .25s ease-in-out, top .25s ease-in-out, left .25s ease-in-out, width .25s ease-in-out',
    transform: 'rotate(0deg)',
    transformOrigin: 'left center',
    ':hover': {
      backgroundColor: LW_BLUE_LIGHT
    },
    ':nth-child(1)': {
      top: 4
    },
    ':nth-child(2)': {
      top: 11
    },
    ':nth-child(3)': {
      top: 18
    }
  },
  '&[aria-expanded=true] span:nth-child(1)': {
    transform: 'rotate(45deg)',
    top: 3,
    left: 2
  },
  '&[aria-expanded=true] span:nth-child(2)': {
    width: 0,
    opacity: 0
  },
  '&[aria-expanded=true] span:nth-child(3)': {
    transform: 'rotate(-45deg)',
    top: 20,
    left: 2
  }
})

const Toggle = ({expanded, onClick, id}) => <button {...toggleStyle}
  onClick={onClick}
  aria-controls={id}
  title={''}
  aria-expanded={expanded}>
  <span />
  <span />
  <span />
</button>

export default Toggle
