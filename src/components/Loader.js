import React, { Component } from 'react'
import { css } from 'glamor'
import { GREY_MID, HEADER_HEIGHT } from '../theme'
import { Center } from './Frame'

const spacerStyle = css({
  position: 'relative',
  minWidth: '100%',
  minHeight: ['100vh', `calc(100vh - ${HEADER_HEIGHT}px)`],
})
const Spacer = ({ height, width, children }) => (
  <div {...spacerStyle} style={{ minWidth: width, minHeight: height }}>
    {children}
  </div>
)

const containerStyle = css({
  position: 'absolute',
  width: 50,
  height: 50,
  top: '50%',
  left: '50%',
})
const spin = css.keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0.15 },
})
const barStyle = css({
  animation: `${spin} 1.2s linear infinite`,
  borderRadius: 5,
  backgroundColor: GREY_MID,
  position: 'absolute',
  width: '20%',
  height: '7.8%',
  top: '-3.9%',
  left: '-10%',
})

class Loader extends Component {
  constructor(properties) {
    super(properties)
    this.state = {
      visible: false,
    }
  }

  componentDidMount() {
    this.timeout = setTimeout(
      () => this.setState({ visible: true }),
      this.props.delay,
    )
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const { visible } = this.state
    const { width, height, loading, error, render } = this.props
    if (loading && !visible) {
      return <Spacer width={width} height={height} />
    } else if (loading) {
      const bars = []
      for (let index = 0; index < 12; index++) {
        const style = {}
        style.WebkitAnimationDelay = style.animationDelay =
          (index - 12) / 10 + 's'
        style.WebkitTransform = style.transform =
          'rotate(' + index * 30 + 'deg) translate(146%)'

        bars.push(<div {...barStyle} style={style} key={index} />)
      }

      return (
        <Spacer width={width} height={height}>
          <div {...containerStyle}>{bars}</div>
        </Spacer>
      )
    } else if (error) {
      return (
        <Spacer width={width} height={height}>
          <Center>{error.toString()}</Center>
        </Spacer>
      )
    }
    return render()
  }
}

Loader.defaultProps = {
  delay: 500,
}

export default Loader
