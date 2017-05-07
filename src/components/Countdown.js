import React, {Component} from 'react'
import {css} from 'glamor'
import {timeMinute} from 'd3-time'
import {timeFormat} from 'd3-time-format'
import {mediaM} from '../theme'

const styles = {
  container: css({
    display: 'flex',
    justifyContent: 'space-between',
    flexFlow: 'row wrap',
    paddingLeft: 50,
    paddingRight: 50,
    marginBottom: 25,
    marginTop: 25,
    [mediaM]: {
      marginBottom: 30
    }
  }),
  holder: css({
    display: 'block',
    margin: 0,
    width: '100%',
    [mediaM]: {
      width: '33%'
    }
  }),
  bigText: css({
    maxWidth: 500,
    margin: '40px auto 0',
    fontSize: 16,
    [mediaM]: {
      marginTop: 80,
      fontSize: 20
    }
  }),
  number: css({
    lineHeight: 1,
    fontSize: 65,
    [mediaM]: {
      fontSize: 180
    },
    padding: 0,
    margin: 0
  }),
  caption: css({
    fontSize: 12,
    marginBottom: 10,
    [mediaM]: {
      marginBottom: 0,
      fontSize: 20
    },
    lineHeight: '1.4em'
  })
}

const toTimeFormat = timeFormat('%d.%m.%Y')

class Countdown extends Component {
  tick () {
    const now = new Date()
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 1

    const {to} = this.props
    if (now > to) {
      window.location = '/'
    }

    clearTimeout(this.timeout)
    this.timeout = setTimeout(
      () => {
        this.setState({
          now
        })
        this.tick()
      },
      msToNextMinute
    )
  }
  componentDidMount () {
    this.tick()
  }
  componentWillUnmount () {
    clearTimeout(this.timeout)
  }
  render () {
    const {to} = this.props

    const now = new Date()

    if (now > to) {
      return null
    }

    const totalMinutes = timeMinute.count(now, to)
    const minutes = totalMinutes % 60
    const hours = Math.floor(totalMinutes / 60) % 24
    const days = Math.floor(totalMinutes / 60 / 24)

    return (
      <div style={{textAlign: 'center'}}>
        <div {...styles.container}>
          <figure {...styles.holder}>
            <div {...styles.number}>{days}</div>
            <figcaption {...styles.caption}>
              {days === 1 ? 'Tag' : 'Tage'}<br />
              {days === 1 ? 'journée' : 'journées'}
            </figcaption>
          </figure>
          <figure {...styles.holder}>
            <div {...styles.number}>{hours}</div>
            <figcaption {...styles.caption}>
              {hours === 1 ? 'Stunde' : 'Stunden'}<br />
              {hours === 1 ? 'horaire' : 'horaires'}
            </figcaption>
          </figure>
          <figure {...styles.holder}>
            <div {...styles.number}>{minutes}</div>
            <figcaption {...styles.caption}>
              {minutes === 1 ? 'Minute' : 'Minuten'}<br />
              {minutes === 1 ? 'minute' : 'minutes'}
            </figcaption>
          </figure>
        </div>
        <div {...styles.bigText}>
          bis zur neuen Webseite am<br />
          au le nouveau site Web à<br />
          <br />
          {toTimeFormat(to)}<br />
          <br />
          Alte Webseite / ancien site Web<br />
          <a href='https://cms.lobbywatch.ch/' target='_blank'>
            cms.lobbywatch.ch
          </a>
        </div>
      </div>
    )
  }
}

export default Countdown
