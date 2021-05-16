import PropTypes from 'prop-types'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { h2Rule, metaRule, ButtonLink, P, TextCenter } from './Styled'
import Message from './Message'

import { css } from 'glamor'
import { WHITE, GREY_SOFT } from '../theme'
import { locales } from '../../constants'

const containerStyle = css({
  overflow: 'hidden',
  borderRadius: '4px',
  backgroundColor: GREY_SOFT,
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
})
const headStyle = css({
  textDecoration: 'none',
  minHeight: 160,
  padding: '16px 24px',
  position: 'relative',
  display: 'flex',
})
const shadeStyle = css({
  display: 'block',
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
})
const titleStyle = css(h2Rule, {
  position: 'relative',
  marginTop: 0,
  marginBottom: 0,
  color: WHITE,
  alignSelf: 'flex-end',
})
const bodyStyle = css({
  padding: '16px 24px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
})
const pStyle = css({
  flexGrow: 1,
})

const Card = ({
  image,
  path,
  title,
  author,
  published,
  lead,
  locale,
  priority,
}) => {
  const fullPath = `/${locale}/${path.join('/')}`
  return (
    <div {...containerStyle}>
      <Link href={fullPath}>
        <a {...headStyle}>
          <Image
            src={image}
            priority={priority}
            sizes='370px'
            layout='fill'
            objectFit='cover'
            quality={90}
          />
          <span {...shadeStyle} />
          <h2 {...titleStyle}>{title}</h2>
        </a>
      </Link>
      <div {...bodyStyle}>
        <span {...metaRule}>
          {[published, author].filter(Boolean).join(' – ')}
        </span>
        <P className={pStyle}>{lead}</P>
        <TextCenter>
          <ButtonLink href={fullPath}>
            <Message id='card/read' locale={locale} />
          </ButtonLink>
        </TextCenter>
      </div>
    </div>
  )
}

Card.propTypes = {
  locale: PropTypes.oneOf(locales).isRequired,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  published: PropTypes.string.isRequired,
  lead: PropTypes.string.isRequired,
  image: PropTypes.string,
}

export default Card
