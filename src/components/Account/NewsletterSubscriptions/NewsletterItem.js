import { css } from 'glamor'
import {
  InlineSpinner,
  Checkbox,
  mediaQueries,
  Interaction,
  fontStyles,
  useColorContext,
} from '@project-r/styleguide'

const GAP_SIZE = 24

const styles = {
  row: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 5,
    paddingBottom: 5,
    gap: GAP_SIZE,
    [mediaQueries.mUp]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    ':not(:last-child)': {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
    },
  }),
  iconTextCol: css({
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    gap: GAP_SIZE,
  }),
  description: css({
    ...fontStyles.sansSerifRegular16,
    margin: '4px 0 8px 0',
  }),
  spinnerWrapper: css({
    width: 24,
    display: 'inline-block',
    height: 0,
    marginLeft: 15,
    verticalAlign: 'middle',
    '& > span': {
      display: 'inline',
    },
  }),
  checkbox: css({
    [mediaQueries.mUp]: {
      width: 148,
      paddingTop: 6,
    },
  }),
}

const NewsletterItem = ({
  onChange,
  subscribed,
  mutating,
  name,
  t,
  onlyName,
  status,
}) => {
  const [colorScheme] = useColorContext()

  const checkboxElement = (
    <Checkbox
      checked={subscribed}
      disabled={mutating || status === 'unsubscribed'}
      onChange={onChange}
    >
      <span>
        {t(
          `account/newsletterSubscriptions/onlyName/${
            subscribed ? 'subscribed' : 'subscribe'
          }`
        )}
        <span {...styles.spinnerWrapper}>
          {mutating && <InlineSpinner size={24} />}
        </span>
      </span>
    </Checkbox>
  )
  if (onlyName) {
    return checkboxElement
  }

  return (
    <div {...styles.row} {...colorScheme.set('borderColor', 'divider')}>
      <div style={{ flex: 1 }}>
        <p {...styles.description}>
          {t(`account/newsletterSubscriptions/${name}/label`)}
        </p>
      </div>
      <div {...styles.checkbox}>{checkboxElement}</div>
    </div>
  )
}

export default NewsletterItem
