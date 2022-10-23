import { Component } from 'react'
import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@project-r/styleguide'

import Frame, { Center } from 'src/components/Frame'
import List, { generateSeed } from 'src/components/Testimonial/List'
import Share from 'src/components/Testimonial/Share'
import TV from 'src/components/Testimonial/TV'
import Image from 'src/components/Testimonial/Image'
import { withInitialProps } from 'lib/apolloClient'
import { PLEDGE_PATH } from 'src/constants'
import { withT } from 'src/components/Message'
import withMe from 'src/components/Auth/withMe'

import { getSafeLocale } from '../../constants'

class CommunityPage extends Component {
  static async getInitialProps(ctx) {
    return {
      seed: generateSeed(),
    }
  }
  render() {
    const {
      router: { query },
      seed,
      serverContext,
      hasActiveMembership,
      t
    } = this.props

    if (query.share) {
      return <Share focus={query.share} pkg={query.package} />
    }

    if (query.tv) {
      return <TV duration={+Math.max(1000, query.duration || 30000)} />
    }

    if (query.img) {
      const order = query.order || 'ASC'
      const defaultSequenceNumber = order === 'DESC' ? Math.pow(10, 6) : 0
      return (
        <Image
          query={query}
          sequenceNumber={+query.sequenceNumber || defaultSequenceNumber}
          orderDirection={order}
          duration={+Math.max(1000, query.duration || 5000)}
        />
      )
    }

    const locale = getSafeLocale(query.locale)

    return (
      <Frame focusMode>
        <Center>
          <List seed={seed} id={query.id} isPage serverContext={serverContext} />
          {!hasActiveMembership && <div style={{marginTop: 40 }}>
            <Link href={{
            pathname: PLEDGE_PATH,
            query: { locale, package: 'YEAR' },
          }} passHref>
            <Button primary style={{ marginRight: 10 }}>{t('footer/member')}</Button>
          </Link>
          <Link href={`/${locale}`} passHref>
            <Button naked>Crowdfunding</Button>
          </Link>
          </div>}
        </Center>
      </Frame>
    )
  }
}

export default withInitialProps(compose(withRouter, withMe, withT)(CommunityPage))
