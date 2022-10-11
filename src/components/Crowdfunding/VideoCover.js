import { Component } from 'react'
import { css } from 'glamor'
import { VideoPlayer, mediaQueries } from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE, ZINDEX_HEADER } from './constants'
import { scrollIt } from 'src/utils/scroll'
import Header from '../Frame/Header'

const MAX_HEIGHT = 0.7
const MAX_HEIGHT_VH = MAX_HEIGHT * 100
const ASPECT_RATIO = 2 / 1

const styles = {
  wrapper: css({
    position: 'relative',
    height: `${(1 / ASPECT_RATIO) * 100}vw`,
    backgroundColor: '#000',
    transition: 'height 200ms',
    '& > div': {
      height: '100%',
    },
  }),
  cover: css({
    position: 'absolute',
    cursor: 'pointer',
    zIndex: 1,
    left: 0,
    top: 0,
    right: 0,
  }),
  maxWidth: css({
    position: 'relative',
    margin: '0 auto',
    maxWidth: `${MAX_HEIGHT_VH * ASPECT_RATIO}vh`,
    overflow: 'hidden',
    textAlign: 'center',
  }),
  poster: css({
    width: 'auto',
    height: `${(1 / ASPECT_RATIO) * 100}vw`,
    transition: 'height 200ms',
  }),
  play: css({
    position: 'absolute',
    top: '60%',
    left: '5%',
    right: '5%',
    marginTop: -18,
    textAlign: 'center',
  }),
}

const VIDEO = {
  // hls: 'https://player.vimeo.com/external/213080233.m3u8?s=40bdb9917fa47b39119a9fe34b9d0fb13a10a92e',
  mp4: 'https://lobbywatch.s3.eu-central-1.amazonaws.com/videos/main_v221010.mov',
  // subtitles: '/static/subtitles/main.vtt',
  thumbnail: 'https://lobbywatch.s3.eu-central-1.amazonaws.com/videos/main_v221010.jpg',
  endScroll: 0.96
}

class VideoCover extends Component {
  constructor(props) {
    super(props)

    this.state = {
      playing: undefined,
      cover: !props.backgroundAutoPlay,
    }
    this.measure = () => {
      this.setState(() => {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        let videoHeight = windowWidth * (1 / ASPECT_RATIO)
        return {
          mobile: windowWidth < mediaQueries.mBreakPoint,
          windowHeight,
          videoHeight,
        }
      })
    }
    this.ref = (ref) => {
      this.player = ref
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.measure)
    this.measure()
    if (this.props.forceAutoPlay && this.player) {
      this.setState(() => {
        this.player.play()
        return {
          cover: false,
        }
      })
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measure)
  }
  render() {
    const {
      limited,
      backgroundAutoPlay,
      muted,
      loop,
      playTop,
      locale,
      menuItems,
      localeLinks
    } = this.props
    const { playing, ended, videoHeight, windowHeight, mobile, cover } =
      this.state

    const limitedHeight = !!limited || !playing || !videoHeight
    const heightStyle = {
      height: playing && !ended && !limitedHeight ? windowHeight : videoHeight,
      maxHeight: limitedHeight ? `${MAX_HEIGHT_VH}vh` : undefined,
    }
    return (
      <div
        {...styles.wrapper}
        style={{
          ...heightStyle,
          zIndex: !limitedHeight ? ZINDEX_HEADER + 1 : undefined,
        }}
      >
        <div
          {...styles.cover}
          style={{ opacity: cover || !playing ? 1 : 0 }}
          onClick={() => {
            this.setState(() => {
              this.player.toggle()
              return {
                clicked: true,
                cover: false,
              }
            })
          }}
        >
          <Header locale={locale} menuItems={menuItems} localeLinks={localeLinks} transparent />
          {cover && <div {...styles.maxWidth}>
            <img src={VIDEO.thumbnail} {...styles.poster} style={heightStyle} />
              <div {...styles.play} style={{ top: playTop }}>
                <VideoPlayer.PlayIcon />
              </div>
          </div>}
        </div>
        <VideoPlayer
          ref={this.ref}
          src={VIDEO}
          showPlay={!cover && playing !== undefined}
          autoPlay={backgroundAutoPlay}
          attributes={
            backgroundAutoPlay
              ? {
                  playsInline: true,
                  'webkit-playsinline': '',
                }
              : {}
          }
          forceMuted={muted}
          loop={loop}
          onPlay={() => {
            if (this.player && this.player.video) {
              const { top } = this.player.video.getBoundingClientRect()
              scrollIt(window.pageYOffset + top, 400)
            }
            this.setState(() => ({
              playing: true,
            }))
          }}
          onPause={() => {
            this.setState(() => ({
              ended: false,
              playing: false,
            }))
          }}
          onProgress={(progress) => {
            if (loop) {
              return
            }

            if (
              progress > VIDEO.endScroll &&
              !ended &&
              videoHeight &&
              !(this.player && this.player.scrubbing)
            ) {
              this.setState(
                () => ({ ended: true }),
                () => {
                  const topFixed = 0 // mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT
                  const duration = 800

                  let top = 0
                  if (this.player && this.player.video) {
                    top =
                      window.pageYOffset +
                      this.player.video.getBoundingClientRect().top
                  }

                  scrollIt(
                    top +
                      Math.min(
                        this.state.videoHeight,
                        this.state.windowHeight * MAX_HEIGHT,
                      ) -
                      topFixed +
                      10,
                    duration,
                  )
                  setTimeout(() => {
                    this.setState(() => ({
                      playing: false,
                    }))
                  }, duration / 2)
                },
              )
            }
            if (progress > 0.999 && !cover) {
              this.setState(() => ({ cover: true }))
            }
          }}
          style={heightStyle.height ? heightStyle : { height: '100%' }}
        />
      </div>
    )
  }
}

export default VideoCover
