import React, { Component, ReactNode } from 'react'
import { css, keyframes } from 'glamor'
import { GREY_MID, HEADER_HEIGHT } from '../theme'
import { Center } from './Frame'

const spacerStyle = css({
  position: 'relative',
  minWidth: '100%',
  minHeight: ['100vh', `calc(100vh - ${HEADER_HEIGHT}px)`],
})
export interface SpacerProps {
  height?: number
  width?: number
  children?: ReactNode
}
const Spacer = ({ height, width, children }: SpacerProps) => (
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
const spin = keyframes({
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

export interface LoaderProps {
  render: () => ReactNode
  delay?: number
  width?: number
  height?: number
  loading?: boolean
  error?: string
}

interface LoaderState {
  visible: boolean
}

class Loader extends Component<LoaderProps, LoaderState> {
  private timeout?: NodeJS.Timeout

  constructor(
    properties: LoaderProps = {
      render: () => null,
      delay: 500,
    },
  ) {
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
        const style = {
          animationDelay: (index - 12) / 10 + 's',
          transform: 'rotate(' + index * 30 + 'deg) translate(146%)',
        }
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

export default Loader
