import { forwardRef, Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { nest } from 'd3-collection'
import { min, ascending } from 'd3-array'

import { withT } from 'src/components/Message'

import {
  fontStyles,
  Loader,
  mediaQueries,
  useColorContext,
  ChevronRightIcon,
} from '@project-r/styleguide'
import Link from 'next/link'

import { PLEDGE_PATH } from 'src/constants'

const styles = {
  packageHeader: css({
    position: 'relative',
    paddingRight: 25,
  }),
  package: css({
    display: 'block',
    textDecoration: 'none',
    marginTop: -1,
    ...fontStyles.sansSerifRegular,
    paddingTop: 7,
    paddingBottom: 9,
    [mediaQueries.mUp]: {
      paddingTop: 10,
      paddingBottom: 16,
    },
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
  }),
  packageHighlighted: css({
    position: 'relative',
    zIndex: 1,
    // marginTop: -1,
    marginBottom: -1,
    marginLeft: -10,
    marginRight: -10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 10,
    [mediaQueries.mUp]: {
      paddingTop: 11,
      paddingBottom: 17,
    },
    width: 'calc(100% + 20px)',
    borderBottom: 'none',
    borderTop: 'none',
    borderRadius: 4,
  }),
  groupTitle: css({
    marginTop: 40,
    marginBottom: 10,
    ...fontStyles.sansSerifMedium,
    fontSize: 19,
    lineHeight: '28px',
    [mediaQueries.mUp]: {
      fontSize: 25,
      lineHeight: '33px',
    },
  }),
  packageTitle: css({
    ...fontStyles.sansSerifMedium,
    fontSize: 16,
    lineHeight: '24px',
    [mediaQueries.mUp]: {
      fontSize: 22,
      lineHeight: '30px',
    },
  }),
  packagePrice: css({
    marginTop: 0,
    fontSize: 16,
    lineHeight: '24px',
    [mediaQueries.mUp]: {
      fontSize: 22,
      lineHeight: '30px',
    },
  }),
  packageIcon: css({
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: '-10px',
  }),
  packageContent: css({
    fontSize: 17,
    lineHeight: '25px',
  }),
  buffer: css({
    // catch negative margin from last package
    marginTop: -1,
  }),
}

const query = gql`
  query pledgeAccordion($crowdfundingName: String!) {
    crowdfunding(name: $crowdfundingName) {
      id
      name
      packages {
        id
        name
        group
        options {
          id
          price
          userPrice
          minAmount
          maxAmount
          defaultAmount
          reward {
            __typename
            ... on MembershipType {
              id
              name
              minPeriods
            }
            ... on Goodie {
              id
              name
            }
          }
        }
      }
    }
  }
`

const PackageItemRaw = (
  { t, hover, setHover, crowdfundingName, name, title, price, onClick, href },
  ref
) => {
  const [colorScheme] = useColorContext()
  return (
    <a
      {...merge(styles.package, hover === name && styles.packageHighlighted)}
      {...colorScheme.set('color', 'text')}
      {...colorScheme.set('borderTopColor', 'divider')}
      {...colorScheme.set('borderBottomColor', 'divider')}
      {...(hover === name && colorScheme.set('background', 'alert'))}
      onMouseOver={() => setHover(name)}
      onFocus={() => setHover(name)}
      onMouseOut={() => setHover(undefined)}
      onBlur={() => setHover(undefined)}
      onClick={onClick}
      href={href}
      ref={ref}
    >
      <div {...styles.packageHeader}>
        <div {...styles.packageTitle}>
          {title ||
            t.first([
              `package/${crowdfundingName}/${name}/title`,
              `package/${name}/title`,
            ])}
        </div>
        {!!price && (
          <div
            {...styles.packagePrice}
            {...colorScheme.set('color', 'primary')}
          >
            {t.first([`package/${name}/price`, 'package/price'], {
              formattedCHF: `CHF ${price / 100}`,
            })}
          </div>
        )}
        <span {...styles.packageIcon}>
          <ChevronRightIcon size={24} />
        </span>
      </div>
    </a>
  )
}
export const PackageItem = forwardRef(PackageItemRaw)

export const PackageBuffer = () => <div {...styles.buffer} />

class Accordion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: undefined,
    }
  }
  render() {
    const { loading, error, compact } = this.props
    if (loading || error) {
      return (
        <Loader loading={loading} error={error} style={{ minHeight: 400 }} />
      )
    }

    const { hover } = this.state

    const { t, locale, packages, filter, group, crowdfundingName, renderIntro } =
      this.props

    const groups = nest()
      .key((d) => d.group)
      .entries(
        packages.filter(filter ? (p) => filter.includes(p.name) : Boolean)
      )

    if (group) {
      groups.sort(
        ({ key: a }, { key: b }) =>
          ascending(+(a !== group), +(b !== group)) ||
          ascending(
            groups.findIndex((d) => d.key === a),
            groups.findIndex((d) => d.key === b)
          )
      )
    }

    return <>
      {renderIntro && renderIntro({ packages })}
      <div style={{ marginTop: 20 }}>
        {groups.map(({ key: group, values: pkgs }) => {

          const setHover = (hover) => this.setState({ hover })

          let pkgItems = pkgs.map((pkg) => {
            let price = pkg.options.reduce(
              (amount, option) => amount + option.price * option.minAmount * (option.reward?.minPeriods || 1),
              0
            )
            if (!price && pkg.name !== 'PROLONG') {
              price =
                min(
                  pkg.options
                    .filter(
                      (o) =>
                        o.reward && o.reward.__typename === 'MembershipType'
                    )
                    .map(
                      (option) =>
                        option.price *
                        (option.minAmount ||
                          option.defaultAmount ||
                          Math.min(1, option.maxAmount))
                    )
                ) || 0
            }
            return {
              pathname: PLEDGE_PATH,
              query: { package: pkg.name, locale },
              name: pkg.name,
              price,
            }
          })

          return (
            <Fragment key={group}>
              {groups.length > 1 && (
                <div
                  {...css(styles.groupTitle, compact && styles.packageTitle)}
                >
                  {t(`package/group/${group}`)}
                </div>
              )}
              {pkgItems.map(({ name, title, price, pathname, query }) => (
                <Link key={name} href={{ pathname, query }} passHref legacyBehavior>
                  <PackageItem
                    t={t}
                    hover={hover}
                    setHover={setHover}
                    name={name}
                    title={title}
                    crowdfundingName={crowdfundingName}
                    price={price}
                  />
                </Link>
              ))}
              <PackageBuffer />
            </Fragment>
          );
        })}
      </div>
    </>;
  }
}

Accordion.propTypes = {
  t: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired
}

const AccordionWithQuery = graphql(query, {
  skip: (props) => !!props.packages,
  props: ({ data }) => {
    return {
      loading: data.loading,
      error: data.error,
      packages: data.crowdfunding && data.crowdfunding.packages,
    }
  },
})(Accordion)

export default withT(AccordionWithQuery)
