import type { ReactNode } from 'react'
import React, { Component } from 'react'
import styles from './Loader.module.css'

export interface SpacerProps {
  height?: number
  width?: number
  children?: ReactNode
}
const Spacer = ({ height, width, children }: SpacerProps) => (
  <div className={styles.spacer} style={{ minWidth: width, minHeight: height }}>
    {children}
  </div>
)

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
        bars.push(<div className={styles.bar} style={style} key={index} />)
      }

      return (
        <Spacer width={width} height={height}>
          <div className={styles.container}>{bars}</div>
        </Spacer>
      )
    } else if (error) {
      return (
        <Spacer width={width} height={height}>
          <div className='u-center-container'>{error.toString()}</div>
        </Spacer>
      )
    }
    return render()
  }
}

export default Loader
