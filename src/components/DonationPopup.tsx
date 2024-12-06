import { FunctionComponent, useEffect, useRef } from 'react'
import { css } from 'glamor'
import { useT } from './Message'
import { getSafeLocale } from '../../constants'
import { useRouter } from 'next/router'
import { Button } from '@project-r/styleguide'
import Link from 'next/link'
import { PLEDGE_PATH } from '../constants'
import Image from 'next/image'

const styles = {
  popup: css({
    '::backdrop': {
      backdropFilter: 'blur(5px)',
    },
    border: 'thin solid #999',
    borderRadius: 4,
  }),
  buttonRow: css({
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
    gap: 10,
  }),
  logo: css({ display: 'flex', justifyContent: 'space-around' }),
}

export const DonationPopup: FunctionComponent = () => {
  const router = useRouter()
  const locale = getSafeLocale(router.query.locale)
  const t = useT(locale)

  const dialog = useRef<HTMLDialogElement>()

  useEffect(() => dialog.current.showModal(), [])

  return (
    <>
      <dialog ref={dialog} {...styles.popup}>
        <figure {...styles.logo}>
          <Image
            src='/static/10_jahre_lw.png'
            alt={t('logo/10-years/alt-text')}
            width={330}
            height={106}
          />
        </figure>
        <p>{t('pledge/popup/text')}</p>
        <div {...styles.buttonRow}>
          <Button onClick={() => dialog.current.close()}>
            {t('pledge/popup/close')}
          </Button>
          <Link
            href={{
              pathname: PLEDGE_PATH,
              query: { locale },
            }}
          >
            <Button primary>{t('pledge/popup/ok')}</Button>
          </Link>
        </div>
      </dialog>
    </>
  )
}
