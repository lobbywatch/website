import { css } from 'glamor'

import ActionBar from '../ActionBar'

import { PUBLIC_BASE_URL, ASSETS_SERVER_BASE_URL } from '../../../constants'

import {
  Interaction,
  fontStyles,
  P as SerifP,
  VideoPlayer,
  mediaQueries,
  inQuotes,
  useColorContext,
} from '@project-r/styleguide'

const { H3, P } = Interaction

const styles = {
  detail: css({
    width: '100%',
    padding: '30px 0',
    [mediaQueries.mUp]: {
      padding: '30px 45px',
    },
  }),
  detailTitle: css({
    lineHeight: '20px',
  }),
  detailRole: css({
    fontSize: 17,
    ...fontStyles.sansSerifRegular,
  }),
  number: css({
    marginBottom: 20,
    ...fontStyles.sansSerifMedium,
  }),
}

const Detail = ({
  t,
  share,
  locale,
  data: {
    id,
    slug,
    name,
    credentials,
    statement,
    portrait,
    sequenceNumber,
    video,
    updatedAt,
  },
}) => {
  const [colorScheme] = useColorContext()
  const shareObject = {
    title: t('statement/share/title', { name }),
    url: `${PUBLIC_BASE_URL}/${locale}/community?id=${id}`,
    emailSubject: t('statement/share/title', { name }),
    emailAttachUrl: false,
    emailBody: `${PUBLIC_BASE_URL}/${locale}/community?id=${id}`,
    overlayTitle: t('statement/share/overlayTitle', { name }),
  }
  return (
    <div {...styles.detail}>
      <div
        style={
          video
            ? {
                maxWidth: 400,
                marginLeft: 'auto',
                marginRight: 'auto',
              }
            : {}
        }
      >
        <H3 {...styles.detailTitle} {...colorScheme.set('color', 'text')}>
          <span>{name}</span>
          {' '}
          <span
            {...styles.detailRole}
            {...colorScheme.set('color', 'textSoft')}
          >
            {credentials && credentials[0] && credentials[0].description}
          </span>
        </H3>
        {video ? (
          <div
            style={{
              marginBottom: 20,
              marginTop: 10,
            }}
          >
            <VideoPlayer
              key={id}
              src={{ ...video, poster: portrait }}
              autoPlay
            />
          </div>
        ) : statement ? (
          <SerifP {...colorScheme.set('color', 'text')}>
            {inQuotes(statement)}
          </SerifP>
        ) : (
          <br />
        )}
        {!!sequenceNumber && false && (
          <P {...styles.number} {...colorScheme.set('color', 'text')}>
            {t('memberships/sequenceNumber/label', {
              sequenceNumber,
            })}
          </P>
        )}
        {share && (
          <ActionBar
            share={shareObject}
            download={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=628&updatedAt=${encodeURIComponent(
              updatedAt
            )}&url=${encodeURIComponent(
              `${PUBLIC_BASE_URL}/${locale}/community?share=${id}`
            )}`}
          />
        )}
      </div>
    </div>
  )
}

Detail.defaultProps = {
  share: true,
}

export default Detail
