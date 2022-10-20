import { Component, useState } from 'react'
import Link from 'next/link'

import { PackageItem, PackageBuffer } from '../Pledge/Accordion'

import { RawStatus, withStatus } from './Status'

import { css } from 'glamor'

import { SIDEBAR_WIDTH } from './constants'

import { Button, A, mediaQueries } from '@project-r/styleguide'
import { PLEDGE_PATH } from 'src/constants'

export const minWindowHeight = 400

const STICKY_TOP_OFFSET = 0

const styles = {
  container: css({
    paddingTop: 10,
    [mediaQueries.onlyS]: {
      marginBottom: 30,
    },
  }),
  sticky: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'block',
      position: 'fixed',
      zIndex: 1,
      width: SIDEBAR_WIDTH,
      top: STICKY_TOP_OFFSET,
    },
  }),
  button: css({
    marginBottom: 10,
    [mediaQueries.onlyS]: {
      display: 'none',
    },
  }),
  links: css({
    lineHeight: '24px',
    marginTop: 13,
    fontSize: 16,
  }),
  packages: css({
    fontSize: 19,
    lineHeight: '28px',
    marginBottom: 15,
  }),
}

const SidebarInner = (props) => {
  const { t, locale, crowdfunding, title, links, packages, primaryQuery } =
    props

  const [hover, setHover] = useState()

  return (
    <div {...styles.container}>
      <div {...styles.packages}>{title}</div>
      {packages.map((pack) => {
        return (
          <Link
            key={pack.name}
            href={{
              pathname: PLEDGE_PATH,
              query: { ...pack.params, package: pack.name, locale },
            }}
            passHref
          >
            <PackageItem
              t={t}
              crowdfundingName={crowdfunding.name}
              {...pack}
              hover={hover}
              setHover={setHover}
            />
          </Link>
        )
      })}
      <PackageBuffer />
      <div style={{ margin: '20px 0' }}>
        <div {...styles.button}>
          <Link
            href={{
              pathname: PLEDGE_PATH,
              query: { ...primaryQuery, locale },
            }}
            passHref
          >
            <Button block primary>
              {t('cf/cta/short')}
            </Button>
          </Link>
        </div>
      </div>
      <div {...styles.links}>
        {links.map((link, i) => (
          <Link key={i} href={link.href} passHref>
            <A>
              {link.text}
              <br />
            </A>
          </Link>
        ))}
      </div>
    </div>
  )
}

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.onScroll = () => {
      const y = window.pageYOffset
      const height = window.innerHeight
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      const { sticky, setSticky } = this.props

      if (!this.inner) {
        return
      }

      let status = false
      let sidebar = false
      if (y + STICKY_TOP_OFFSET > this.y) {
        status = true
        if (
          !mobile &&
          height - STICKY_TOP_OFFSET > this.innerHeight &&
          height >= minWindowHeight
        ) {
          sidebar = true
        }
      }

      if (sticky.status !== status || sticky.sidebar !== sidebar) {
        setSticky({
          status,
          sidebar,
        })
      }
    }
    this.innerRef = (ref) => {
      this.inner = ref
    }
    this.measure = () => {
      if (this.inner) {
        const rect = this.inner.getBoundingClientRect()

        this.y = window.pageYOffset + rect.top
        this.innerHeight = rect.height

        const right = window.innerWidth - rect.right

        if (right !== this.state.right) {
          this.setState(() => ({
            right,
          }))
        }
      }
      this.onScroll()
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate() {
    this.measure()
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }
  render() {
    const { right } = this.state
    const {
      sticky,
      t,
      locale,
      crowdfunding,
      primaryQuery,
      title,
      links,
      packages,
      statusProps,
    } = this.props

    const onChange = (state) => this.setState(() => state)

    if (!crowdfunding) {
      return null
    }

    return (
      <div>
        <RawStatus
          people
          t={t}
          crowdfundingName={crowdfunding.name}
          crowdfunding={crowdfunding}
          {...statusProps}
        />

          <div
            ref={this.innerRef}
            style={{
              visibility: sticky.sidebar ? 'hidden' : 'visible',
            }}
          >
            <SidebarInner
              title={title}
              links={links}
              packages={packages}
              primaryQuery={primaryQuery}
              t={t}
              locale={locale}
              crowdfunding={crowdfunding}
              onChange={onChange}
              state={this.state}
            />
          </div>

          {!!sticky.sidebar && (
            <div {...styles.sticky} style={{ right: right }}>
              <SidebarInner
                title={title}
                links={links}
                packages={packages}
                primaryQuery={primaryQuery}
                t={t}
                locale={locale}
                crowdfunding={crowdfunding}
                onChange={onChange}
                state={this.state}
              />
            </div>
          )}
      </div>
    )
  }
}

export default withStatus(Sidebar)
