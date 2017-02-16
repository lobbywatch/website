import React, {PropTypes} from 'react'
import {css} from 'glamor'

import {metaRule} from './Styled'
import {WHITE, GREY_DARK, GREY_LIGHT, BLACK} from '../theme'

const boxStyle = css({
  position: 'absolute',
  backgroundColor: WHITE,
  color: GREY_DARK,
  boxShadow: '0 2px 24px 0 rgba(0,0,0,0.25)',
  fontSize: 14,
  lineHeight: '1.1em',
  padding: '12px 16px',
  pointerEvents: 'none',
  zIndex: 10,
  minWidth: 200,
  borderRadius: 4
})

const boxPosition = {
  top: {
    center: css({transform: 'translateX(-50%) translateY(-100%)'}),
    left: css({transform: 'translateX(-15%) translateY(-100%)'}),
    right: css({transform: 'translateX(-85%) translateY(-100%)'})
  },
  below: {
    center: css({transform: 'translateX(-50%) translateY(0%)'}),
    left: css({transform: 'translateX(-15%) translateY(0%)'}),
    right: css({transform: 'translateX(-85%) translateY(0%)'})
  }
}

const notchStyle = css({
  position: 'absolute',
  width: 0,
  height: 0,
  borderStyle: 'solid',
  borderWidth: '8px 7.5px 0 7.5px',
  borderColor: `${WHITE} transparent transparent transparent`
})

const notchPosition = {
  top: {
    center: css({bottom: -8, transform: 'translateX(-50%)', left: '50%'}),
    left: css({bottom: -8, transform: 'translateX(-50%)', left: '15%'}),
    right: css({bottom: -8, transform: 'translateX(50%)', right: '15%'})
  },
  bottom: {
    center: css({top: -8, transform: 'translateX(-50%) rotate(180deg)', left: '50%'}),
    left: css({top: -8, transform: 'translateX(-50%) rotate(180deg)', left: '15%'}),
    right: css({top: -8, transform: 'translateX(50%) rotate(180deg)', right: '15%'})
  }
}

const labledValueStyle = css({
  fontSize: 14,
  lineHeight: '20px',
  borderBottom: `1px solid ${GREY_LIGHT}`,
  paddingBottom: 10,
  marginBottom: 5,
  color: BLACK,
  ':last-child': {
    borderBottom: 'none',
    paddingBottom: 5,
    marginBottom: 0
  }
})

export const ContextBoxValue = ({label, children}) => {
  if (!children) {
    return null
  }
  return (
    <div {...labledValueStyle}>
      {!!label && <span {...metaRule}>{label}<br /></span>}
      {children}
    </div>
  )
}

ContextBoxValue.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node
}

const ContextBox = ({orientation: yOrientation, x, y, contextWidth, children}) => {
  let xOrientation = 'center'
  if (contextWidth - x < 100) {
    xOrientation = 'right'
  } else if (x < 100) {
    xOrientation = 'left'
  }

  return (
    <div {...boxStyle}
      className={boxPosition[yOrientation][xOrientation]}
      style={{left: x, top: y}}>
      <div>
        {children}
      </div>
      <div {...notchStyle}
        className={notchPosition[yOrientation][xOrientation]} />
    </div>
  )
}

ContextBox.defaultProps = {
  orientation: 'top'
}
ContextBox.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  contextWidth: PropTypes.number.isRequired,
  orientation: PropTypes.oneOf(['top', 'below']).isRequired,
  children: PropTypes.node
}

export default ContextBox
