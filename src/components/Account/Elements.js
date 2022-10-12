import { useMemo } from 'react'
import { css } from 'glamor'
import { useRouter } from 'next/router'
import compose from 'lodash/flowRight'

import withMe from 'src/components/Auth/withMe'
import { withT } from 'src/components/Message'
import SignIn from '../../components/Auth/SignIn'

import {
  timeFormat,
  Interaction,
  Label,
  fontStyles,
  useColorContext,
  plainButtonRule,
  Center,
} from '@project-r/styleguide'

const styles = {
  p: css({
    margin: 0,
    ...fontStyles.sansSerifRegular18,
  }),
  container: css({
    '&:not(:last-child)': css({
      marginBottom: 24,
    }),
  }),
  highlightBox: css({
    padding: 5,
    margin: -5
  })
}

const { H3 } = Interaction

const hourFormat = timeFormat('%H:%M')
const dayFormat = timeFormat('%d. %B %Y')

const HighlightBox = ({ children }) => {
  const [colorScheme] = useColorContext()
  return <div {...styles.highlightBox} {...colorScheme.set(
    'backgroundColor',
    'hover',
  )}>
    {children}
  </div>
}

export const Item = withT(
  ({ t, highlighted, title, createdAt, children, compact }) => {
    
    const content = (
      <div
        {...styles.container}
        style={{ marginBottom: compact ? 0 : undefined }}
      >
        <H3>{title}</H3>
        {!compact && (
          <>
            <Label>
              {t('account/item/label', {
                formattedDate: dayFormat(createdAt),
                formattedTime: hourFormat(createdAt),
              })}
            </Label>
            <br />
          </>
        )}
        {children}
      </div>
    )
    if (highlighted) {
      return <HighlightBox>{content}</HighlightBox>
    }
    return content
  },
)

export const EditButton = ({ children, onClick }) => {
  const [colorScheme] = useColorContext()
  const buttonStyleRules = useMemo(
    () =>
      css(plainButtonRule, {
        ...fontStyles.sansSerifRegular16,
        color: colorScheme.getCSSColor('primary'),
        '@media (hover)': {
          ':hover': {
            color: colorScheme.getCSSColor('primaryHover'),
          },
        },
      }),
    [colorScheme],
  )
  return (
    <button {...buttonStyleRules} onClick={onClick}>
      {children}
    </button>
  )
}

export const P = ({ children, ...props }) => (
  <p {...props} {...styles.p} {...Interaction.fontRule}>
    {children}
  </p>
)

export const Hint = ({ t, tKey }) => {
  const [colorScheme] = useColorContext()
  return (
    <Label
      style={{
        marginTop: -12,
        marginBottom: 12,
        display: 'block',
      }}
    >
      <span {...colorScheme.set('color', 'textSoft')}>{t(tKey)}</span>
    </Label>
  )
}

export const HintArea = ({ children }) => {
  const [colorScheme] = useColorContext()
  return (
    <div
      style={{ padding: '8px 16px' }}
      {...colorScheme.set('backgroundColor', 'hover')}
    >
      <p {...styles.p}>{children}</p>
    </div>
  )
}

export const AccountEnforceMe = compose(
  withT,
  withMe,
)(({ t, me, children }) => {
  const { query } = useRouter()

  return !me ? (
    <Center>
      <Interaction.H1 style={{ marginBottom: 22 }}>
        {t('account/signedOut/title')}
      </Interaction.H1>
      <Interaction.P>{t('account/signedOut/signIn')}</Interaction.P>
      <SignIn email={query.email} />
    </Center>
  ) : (
    children
  )
})
