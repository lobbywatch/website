import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { css } from 'glamor'
import Head from 'next/head'

import { withT } from 'src/components/Message'

import Loader from '../Loader'

import { fontStyles, inQuotes } from '@project-r/styleguide'
import { LW_BLUE_DARK, LW_BLUE_LIGHT, WHITE } from '../../theme'
import Logo from 'src/assets/Logo'

const WIDTH = 1200
const HEIGHT = 628

const styles = {
  container: css({
    position: 'relative',
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#fff',
  }),
  logo: css({
    position: 'absolute',
    left: 628 + 50,
    right: 210,
    bottom: 50,
    fontSize: 24,
    lineHeight: '34px',
    textDecoration: 'none',
    color: LW_BLUE_LIGHT,
  }),
  logoText: css({
    verticalAlign: 'top',
    display: 'inline-block',
    marginTop: -1,
    marginLeft: 10,
  }),
  image: css({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 628,
  }),
  text: css({
    position: 'absolute',
    top: 50,
    left: 628 + 50,
    right: 50,
    bottom: 50 + 70,
    wordWrap: 'break-word',
    overflow: 'hidden',
  }),
  quote: css({
    fontSize: 27,
    lineHeight: 1.42,
    ...fontStyles.serifRegular,
    margin: '20px 0',
  }),
  number: css({
    fontSize: 30,
    ...fontStyles.sansSerifMedium,
  }),
  videoTitle: css({
    fontSize: 60,
    lineHeight: '75px',
    marginBottom: 20,
  }),
  headline: css({
    fontSize: 32,
    ...fontStyles.sansSerifMedium,
  }),
}

const fontSizeBoost = (length) => {
  if (length < 40) {
    return 26
  }
  if (length < 50) {
    return 17
  }
  if (length < 80) {
    return 9
  }
  if (length < 100) {
    return 8
  }
  if (length < 150) {
    return 4
  }
  if (length < 160) {
    return 3
  }
  if (length < 180) {
    return 2
  }
  if (length < 190) {
    return 1
  }
  if (length > 400) {
    return -2
  }
  return 0
}

const Item = ({
  loading,
  error,
  t,
  statement: { statement, portrait, sequenceNumber } = {},
}) => {
  return (
    <Loader
      loading={loading}
      error={error}
      render={() => {
        return (
          <div
            {...styles.container}
            style={{
              backgroundColor: LW_BLUE_DARK,
              color: WHITE,
            }}
          >
            <Head>
              <meta name='robots' content='noindex' />
            </Head>
            <img {...styles.image} alt='' src={portrait} />
            <div {...styles.text}>
              {statement && (
                <p
                  {...styles.quote}
                  style={{
                    fontSize: 26 + fontSizeBoost(statement.length),
                  }}
                >
                  {inQuotes(statement)}
                </p>
              )}
              {!!sequenceNumber && false && (
                <div {...styles.number}>
                  {t('memberships/sequenceNumber/label', {
                    sequenceNumber,
                  })}
                </div>
              )}
            </div>
            <div {...styles.logo}>
              <Logo size={32} />
              <span {...styles.logoText}>Lobbywatch</span>
            </div>
          </div>
        )
      }}
    />
  )
}

const query = gql`
  query statements($focus: String!) {
    user(slug: $focus) {
      id
      name
      statement
      portrait
      sequenceNumber
    }
    statements(focus: $focus, first: 1) {
      totalCount
      nodes {
        id
        name
        statement
        portrait
        sequenceNumber
      }
    }
  }
`

export default compose(
  withT,
  graphql(query, {
    props: ({ data }) => {
      return {
        loading: data.loading,
        error: data.error,
        statement: data.user
          ? data.user
          : data.statements &&
            data.statements.nodes &&
            data.statements.nodes[0],
      }
    },
  })
)(Item)
