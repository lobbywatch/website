import { useState, useEffect } from 'react'
import { css } from 'glamor'
import { IconButton } from '@project-r/styleguide'
import {
  TwitterIcon,
  FacebookIcon,
  WhatsappIcon,
  MailIcon,
  LinkIcon,
  TelegramIcon,
  ThreemaIcon,
} from '@project-r/styleguide'

import { useT } from 'src/components/Message'
import copyToClipboard from 'clipboard-copy'

const ShareButtons = ({
  url,
  tweet,
  emailSubject,
  emailBody,
  emailAttachUrl,
  fill,
  onClose,
  grid,
}) => {
  const [copyLinkSuffix, setLinkCopySuffix] = useState()
  const t = useT()

  useEffect(() => {
    if (copyLinkSuffix === 'success') {
      const timeout = setTimeout(() => {
        setLinkCopySuffix()
      }, 5 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [copyLinkSuffix])

  const emailAttache = emailAttachUrl ? `\n\n${url}` : ''

  const shareOptions = [
    {
      name: 'mail',
      href: `mailto:?subject=${encodeURIComponent(
        emailSubject,
      )}&body=${encodeURIComponent(emailBody + emailAttache)}`,
      icon: MailIcon,
      title: t('actionbar/email/title'),
      label: t('actionbar/email/label'),
    },
    {
      name: 'copyLink',
      href: url,
      icon: LinkIcon,
      title: t('actionbar/link/title'),
      label: (
        <span style={{ display: 'inline-block', minWidth: 88 }}>
          {t(
            `actionbar/link/label${copyLinkSuffix ? `/${copyLinkSuffix}` : ''}`,
          )}
        </span>
      ),
      onClick: (e) => {
        e.preventDefault()
        copyToClipboard(url)
          .then(() => setLinkCopySuffix('success'))
          .catch(() => setLinkCopySuffix('error'))
      },
    },
    {
      name: 'facebook',
      target: '_blank',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url,
      )}`,
      icon: FacebookIcon,
      title: t('actionbar/facebook/title'),
      label: t('actionbar/facebook/label'),
    },
    {
      name: 'twitter',
      target: '_blank',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet,
      )}&url=${encodeURIComponent(url)}`,
      icon: TwitterIcon,
      title: t('actionbar/twitter/title'),
      label: t('actionbar/twitter/label'),
    },
    {
      name: 'whatsapp',
      target: '_blank',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
      icon: WhatsappIcon,
      title: t('actionbar/whatsapp/title'),
      label: t('actionbar/whatsapp/label'),
    },
    {
      name: 'threema',
      target: '_blank',
      href: `https://threema.id/compose?text=${encodeURIComponent(url)}`,
      icon: ThreemaIcon,
      title: t('actionbar/threema/title'),
      label: t('actionbar/threema/label'),
    },
    {
      name: 'telegram',
      target: '_blank',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
      icon: TelegramIcon,
      title: t('actionbar/telegram/title'),
      label: t('actionbar/telegram/label'),
    },
  ].filter(Boolean)

  return (
    <div {...styles.shared} {...styles[grid ? 'center' : 'left']}>
      {shareOptions.map((props) => {
        return (
          <IconButton
            {...props}
            key={props.title}
            Icon={props.icon}
            label={props.label}
            labelShort={props.label}
            fill={fill}
            onClick={(e) => {
              if (props.onClick) {
                return props.onClick(e)
              }
              onClose && onClose()
            }}
          />
        )
      })}
    </div>
  )
}

const styles = {
  shared: css({
    display: 'flex',
    flexWrap: 'wrap',
    '@media print': {
      display: 'none',
    },
    '& > a': {
      flex: 'auto',
      flexGrow: 0,
    },
  }),
  left: css({
    justifyContent: 'flex-start',
    '& > a': {
      marginTop: 15,
    },
  }),
  center: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    '& > a': {
      margin: 15,
    },
  }),
}

export default ShareButtons
