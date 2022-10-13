import { Component } from 'react'
import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'
import Frame, { Center } from 'src/components/Frame'
import List, { generateSeed } from 'src/components/Testimonial/List'
import Share from 'src/components/Testimonial/Share'
import TV from 'src/components/Testimonial/TV'
import Image from 'src/components/Testimonial/Image'
import { withInitialProps } from 'lib/apolloClient'

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

    return (
      <Frame focusMode>
        <Center>
          <List seed={seed} id={query.id} isPage serverContext={serverContext} />
        </Center>
      </Frame>
    )
  }
}

export default withInitialProps(compose(withRouter)(CommunityPage))
