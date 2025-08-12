import { useState } from 'react'
import { css } from 'glamor'
import { DownloadIcon, ShareIcon, IconButton } from '@project-r/styleguide'

import ShareOverlay from './ShareOverlay'

const ActionBar = ({ share, download, isCentered }) => {
  const [shareOverlayVisible, setShareOverlayVisible] = useState(false)

  return (
    <div {...styles.topRow} {...(isCentered && { ...styles.centered })}>
      {download && (
        <IconButton href={download} Icon={DownloadIcon} target='_blank' />
      )}
      {share && (
        <IconButton
          label={share.label || ''}
          Icon={ShareIcon}
          href={share.url}
          onClick={(e) => {
            e.preventDefault()
            setShareOverlayVisible(!shareOverlayVisible)
          }}
        />
      )}
      {shareOverlayVisible && (
        <ShareOverlay
          onClose={() => setShareOverlayVisible(false)}
          url={share.url}
          title={share.overlayTitle}
          tweet={share.tweet || ''}
          emailSubject={share.emailSubject || ''}
          emailBody={share.emailBody || ''}
          emailAttachUrl={share.emailAttachUrl}
        />
      )}
    </div>
  )
}

const styles = {
  topRow: css({
    display: 'flex',
  }),
  flexWrap: css({
    flexWrap: 'wrap',
    rowGap: 16,
  }),
  bottomRow: css({
    display: 'flex',
    marginTop: 24,
  }),
  overlay: css({
    marginTop: 0,
    width: '100%',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
  }),
  feed: css({
    marginTop: 10,
  }),
  centered: css({
    justifyContent: 'center',
  }),
  shareTitle: css({
    margin: '16px 0 0 0',
  }),
}

export default ActionBar
