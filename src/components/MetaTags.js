import React, {PropTypes} from 'react'
import Head from 'next/head'
import {withT} from './Message'

const Raw = ({title: pageTitle, description, image}) => {
  const title = [pageTitle, 'Lobbywatch.ch'].filter(Boolean).join(' – ')

  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      {!!image && <meta property='og:image' content={image} />}
      <meta name='twitter:card' content={image ? 'summary_large_image' : 'summary'} />
      <meta name='twitter:site' content='@Lobbywatch_CH' />
      <meta name='twitter:creator' content='@Lobbywatch_CH' />
    </Head>
  )
}

Raw.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string
}

const MetaTags = ({locale, t, fromT, data, ...rest}) => {
  let props = rest
  if (fromT) {
    props = {
      ...props,
      ...fromT(t)
    }
  }
  if (data) {
    props = {
      ...props,
      title: data.name,
      description: ''
    }
  }
  return <Raw {...props} />
}

export default withT(MetaTags)
