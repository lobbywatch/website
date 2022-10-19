import { Component } from 'react'
import { css } from 'glamor'
import { VideoPlayer, mediaQueries } from '@project-r/styleguide'

import { ZINDEX_HEADER } from './constants'
import { scrollIt } from 'src/utils/scroll'
import Header from '../Frame/Header'
import { CDN_FRONTEND_BASE_URL } from '../../../constants'
import { HEADER_HEIGHT } from '../../theme'

const MAX_HEIGHT = 0.7
const MAX_HEIGHT_VH = MAX_HEIGHT * 100
const ASPECT_RATIO = 2 / 1

const styles = {
  wrapper: css({
    boxSizing: 'content-box',
    position: 'relative',
    height: `${(1 / ASPECT_RATIO) * 100}vw`,
    backgroundColor: '#000',
    transition: 'height 200ms',
  }),
  cover: css({
    position: 'absolute',
    cursor: 'pointer',
    zIndex: 1,
    left: 0,
    top: 0,
    right: 0,
    height: '100%',
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
    top: '70%',
    left: '5%',
    right: '5%',
    marginTop: -18,
    textAlign: 'center',
  }),
}

const VIDEO = {
  hls: 'https://player.vimeo.com/external/760844557.m3u8?s=eec4c51a1b001a6c47cd64747f4a135abad225d2',
  mp4: 'https://player.vimeo.com/progressive_redirect/playback/760844557/rendition/1080p/file.mp4?loc=external&signature=be548dce517a7951f7fbfd808a80a017d7d57386675d3cc83b7ee7dd98162231',
  // subtitles: '/static/subtitles/main.vtt',
  thumbnail: `${CDN_FRONTEND_BASE_URL}/static/crowdfunding_video_thumbnail.jpg`,
  endScroll: 0.99,
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
        const mobile = windowWidth < mediaQueries.mBreakPoint
        const videoHeight = windowWidth * (1 / ASPECT_RATIO)
        return {
          mobile,
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
      localeLinks,
    } = this.props
    const { playing, ended, videoHeight, windowHeight, cover, mobile } =
      this.state

    const limitedHeight = !!limited || !playing || !videoHeight
    const heightStyle = {
      height: playing && !ended && !limitedHeight ? windowHeight : videoHeight,
      maxHeight: limitedHeight ? `${MAX_HEIGHT_VH}vh` : undefined,
      paddingTop: mobile && !playing ? HEADER_HEIGHT / 2 : 0,
      paddingBottom: mobile && !playing ? HEADER_HEIGHT / 2 : 0,
    }
    if (heightStyle.maxHeight && heightStyle.height) {
      heightStyle.height = Math.min(
        windowHeight * MAX_HEIGHT -
          heightStyle.paddingTop -
          heightStyle.paddingBottom,
        heightStyle.height
      )
    }
    return (
      <div
        {...styles.wrapper}
        style={{
          maxHeight: heightStyle.maxHeight,
          height:
            heightStyle.height &&
            heightStyle.height +
              heightStyle.paddingTop +
              heightStyle.paddingBottom,
          zIndex: !limitedHeight ? ZINDEX_HEADER + 1 : undefined,
        }}
      >
        {!playing && (
          <Header
            locale={locale}
            menuItems={menuItems}
            localeLinks={localeLinks}
            transparent
          />
        )}
        <div
          {...styles.cover}
          style={{
            opacity: cover || !playing ? 1 : 0,
          }}
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
          {cover && (
            <div {...styles.maxWidth}>
              <img
                src={VIDEO.thumbnail}
                {...styles.poster}
                style={heightStyle}
              />
              <div {...styles.play} style={{ top: playTop }}>
                <VideoPlayer.PlayIcon />
              </div>
            </div>
          )}
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
                  const topFixed = 0
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
                        this.state.windowHeight * MAX_HEIGHT
                      ) -
                      topFixed +
                      10,
                    duration
                  )
                  setTimeout(() => {
                    this.setState(() => ({
                      playing: false,
                    }))
                  }, duration / 2)
                }
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
