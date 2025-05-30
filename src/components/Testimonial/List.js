import { forwardRef, Fragment, Component } from 'react'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { css, merge } from 'glamor'
import { max } from 'd3-array'

import MetaTags from 'src/components/MetaTags'
import { withT } from 'src/components/Message'
import Loader from '../Loader'

import Detail from './Detail'

import {
  PUBLIC_BASE_URL,
  ASSETS_SERVER_BASE_URL,
  getSafeLocale,
  CDN_FRONTEND_BASE_URL,
} from '../../../constants'

import {
  Interaction,
  mediaQueries,
  fontStyles,
  Field,
  A,
  useColorContext,
  shouldIgnoreClick,
} from '@project-r/styleguide'
import { withRouter } from 'next/router'
import ErrorMessage from '../ErrorMessage'

const { P } = Interaction

const SIZES = [
  { minWidth: 0, columns: 1 },
  { minWidth: 200, columns: 2 },
  { minWidth: 400, columns: 3 },
  { minWidth: 600, columns: 4 },
  { minWidth: 880, columns: 5 },
  { minWidth: 1050, columns: 6 },
]

const PADDING = 5

const getItemStyles = (singleRow, minColumns = 1, maxColumns = 5) => {
  const sizes = [
    { minWidth: 0, columns: minColumns },
    ...SIZES.filter(
      ({ columns }) => columns > minColumns && columns <= maxColumns
    ),
  ]
  return css({
    display: 'block',
    lineHeight: 0,
    padding: PADDING,
    position: 'relative',
    flexShrink: singleRow ? 0 : undefined,
    ...sizes.reduce((styles, size) => {
      const width = `${100 / size.columns}%`
      if (size.minWidth) {
        styles[`@media only screen and (min-width: ${size.minWidth}px)`] = {
          width,
        }
      } else {
        styles.width = width
      }
      return styles
    }, {}),
  })
}

const styles = {
  grid: css({
    margin: '0 -5px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }),
  singleRowGrid: css({
    flexWrap: 'nowrap',
    overflow: 'hidden',
  }),
  item: getItemStyles(false),
  singleRowItem: getItemStyles(true),
  aspect: css({
    display: 'block',
    width: '100%',
    paddingBottom: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ccc',
    borderRadius: 4,
  }),
  aspectImg: css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  }),
  aspectFade: css({
    position: 'absolute',
    background: [
      'rgba(0,0,0,0.15)',
      'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.80) 100%)'
    ],
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  }),
  previewImage: css({
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'block',
  }),
  itemArrow: css({
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -12.5,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '0 12.5px 17px 12.5px',
  }),
  name: css({
    position: 'absolute',
    bottom: PADDING + 5,
    left: PADDING + 5,
    right: PADDING + 5,
    fontSize: 12,
    lineHeight: '15px',
    [mediaQueries.mUp]: {
      fontSize: 16,
      lineHeight: '21px',
    },
    color: '#fff',
    ...fontStyles.sansSerifMedium,
  }),
  play: css({
    position: 'absolute',
    right: PADDING + 5,
    top: PADDING + 5,
  }),
  more: css({
    marginTop: 15,
  }),
  options: css({
    marginBottom: 15,
  }),
}

export const Item = forwardRef(
  (
    {
      previewImage,
      image,
      name,
      isActive,
      href,
      onClick,
      singleRow,
      minColumns,
      maxColumns,
      style,
    },
    ref
  ) => {
    const [colorScheme] = useColorContext()

    const itemStyles = minColumns
      ? getItemStyles(singleRow, minColumns, maxColumns)
      : singleRow
      ? styles.singleRowItem
      : styles.item
    const Element = href ? 'a' : 'span'

    return (
      <Element
        ref={ref}
        href={href}
        {...itemStyles}
        style={{
          ...style,
          cursor: href ? 'pointer' : undefined,
        }}
        onClick={href && onClick}
      >
        <span {...styles.aspect}>
          {previewImage ? (
            <span
              {...styles.previewImage}
              style={{
                backgroundImage: `url(${previewImage})`,
              }}
            />
          ) : (
            <img src={image} alt='' {...styles.aspectImg} />
          )}
          <span {...styles.aspectFade} style={{ opacity: isActive ? 0 : 1 }} />
        </span>
        {!isActive && <span {...styles.name}>{name}</span>}
        {isActive && (
          <span
            {...styles.itemArrow}
            {...css({
              borderColor: []
                .concat(colorScheme.getCSSColor('default'))
                .map((color) => `transparent transparent ${color} transparent`),
            })}
          />
        )}
      </Element>
    )
  }
)
Item.displayName = 'Item'

const AUTO_INFINITE = 300

export class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seed: props.seed || generateSeed(),
      columns: 3,
      open: {
        0: props.focus,
      },
    }
    this.measure = () => {
      const maxColumns = this.getMaxColumns()
      const sizeIndex = max(SIZES, (d, i) =>
        d.minWidth <= window.innerWidth && maxColumns >= d.columns ? i : -1
      )
      const size = SIZES[sizeIndex]
      const columns = size.columns
      if (columns !== this.state.columns && this.props.statements) {
        this.setState(() => ({
          columns,
          open: {
            0: this.props.focus,
          },
        }))
      }
      this.onScroll()
    }
    this.ref = (ref) => {
      this.container = ref
    }
    this.onScroll = () => {
      const { statements, isPage, hasMore } = this.props

      if (this.container && isPage && statements) {
        const bbox = this.container.getBoundingClientRect()
        if (bbox.bottom < window.innerHeight * 2) {
          const { isFetchingMore, endless } = this.state
          if (
            isFetchingMore ||
            !hasMore ||
            (statements.length >= AUTO_INFINITE && !endless)
          ) {
            return
          }
          this.setState(
            () => ({
              isFetchingMore: true,
            }),
            () => {
              const query = (this.query = [
                this.props.seed,
                this.props.focus,
                this.props.query,
              ].join('_'))
              this.props.loadMore().then(() => {
                if (query !== this.query) {
                  this.setState(
                    () => ({
                      isFetchingMore: false,
                    }),
                    () => {
                      this.onScroll()
                    }
                  )
                  return
                }
                this.setState(() => ({
                  isFetchingMore: false,
                }))
              })
            }
          )
        }
      }
    }
  }
  componentDidMount() {
    this.props.isPage && window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate(prevProps) {
    this.measure()
    if (prevProps.focus !== this.props.focus) {
      this.setState({
        open: {
          0: this.props.focus,
        },
      })
    }
  }
  componentWillUnmount() {
    this.props.isPage && window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }
  getMaxColumns() {
    return (
      this.props.maxColumns || (this.props.singleRow ? this.props.first : 5)
    )
  }
  render() {
    const {
      loading,
      error,
      statements,
      t,
      onSelect,
      focus,
      isPage,
      search,
      hasMore,
      totalCount,
      singleRow,
      minColumns,
      showCredentials,
      share,
      serverContext,
      locale,
    } = this.props
    const { columns, open } = this.state

    const hasEndText = !search && isPage

    const gridStyles = !singleRow
      ? styles.grid
      : merge(styles.grid, styles.singleRowGrid)

    return (
      <Loader
        loading={loading}
        style={singleRow ? { minHeight: focus ? 380 : 150 } : undefined}
        error={error}
        render={() => {
          const items = []
          const lastIndex = statements.length - 1
          const focusItem = statements[0]?.id === focus && statements[0]

          const hasNotFoundFocus = focus && !focusItem
          if (hasNotFoundFocus && serverContext) {
            serverContext.res.statusCode = 404
          }

          const singleRowOpenItem =
            singleRow &&
            open[0] &&
            statements.find((statement) => statement.id === open[0])

          statements.forEach(({ id, portrait, name, credentials }, i) => {
            const row = singleRow ? 0 : Math.floor(i / columns)
            const offset = i % columns
            const openId = open[row - 1]
            if (!singleRow && openId && offset === 0) {
              const openItem = statements.find(
                (statement) => statement.id === openId
              )
              if (openItem) {
                items.push(
                  <Detail
                    key={`detail${row - 1}`}
                    share={share}
                    t={t}
                    locale={locale}
                    data={openItem}
                  />
                )
              }
            }

            const isActive = open[row] === id
            const credential =
              showCredentials &&
              credentials &&
              credentials[0] &&
              credentials[0].description
            const label = [name, credential].filter(Boolean).join(', ')

            // unclear why this is needed after moving from render.com to deplo.io -- env vars are the same.
            // why does the rewrite in next.config.js not work?
            const rewrittenPortrait = portrait.replace('https://lobbywatch.ch/assets', 'https://assets.lobbywatch.ch')

            items.push(
              <Item
                key={id}
                image={rewrittenPortrait}
                name={label}
                isActive={isActive}
                singleRow={singleRow}
                minColumns={minColumns}
                maxColumns={this.getMaxColumns()}
                href={id && `/${locale}/community?id=${id}`}
                onClick={(e) => {
                  if (shouldIgnoreClick(e)) {
                    return
                  }
                  e.preventDefault()
                  if (onSelect && onSelect(id) === false) {
                    return
                  }
                  this.setState((state) => ({
                    open: {
                      ...state.open,
                      [row]: state.open[row] === id ? undefined : id,
                    },
                  }))
                }}
              />
            )

            const lastOpenId = open[row]
            if (!singleRow && i === lastIndex && lastOpenId) {
              const openItem = statements.find(
                (statement) => statement.id === lastOpenId
              )
              if (openItem) {
                items.push(
                  <Detail
                    key={`detail${row}`}
                    share={share}
                    t={t}
                    locale={locale}
                    data={openItem}
                  />
                )
              }
            }
          })

          const metaData = focusItem
            ? {
                pageTitle: t('testimonial/meta/single/pageTitle', focusItem),
                title: t('testimonial/meta/single/title', focusItem),
                description: t(
                  'testimonial/meta/single/description',
                  focusItem
                ),
                url: `${PUBLIC_BASE_URL}/${locale}/community?id=${focusItem.id}`,
                image: `${ASSETS_SERVER_BASE_URL}/render?viewport=1200x628&updatedAt=${encodeURIComponent(
                  focusItem.updatedAt
                )}&url=${encodeURIComponent(
                  `${PUBLIC_BASE_URL}/${locale}/community?share=${focusItem.id}`
                )}`,
              }
            : {
                pageTitle: t('testimonial/meta/pageTitle'),
                title: t('testimonial/meta/title'),
                description: t('testimonial/meta/description'),
                url: `${PUBLIC_BASE_URL}/${locale}/community`,
                image: `${CDN_FRONTEND_BASE_URL}/static/social/community.jpg`,
              }

          return (
            <Fragment>
              {!!isPage && <MetaTags {...metaData} />}
              {hasNotFoundFocus && <ErrorMessage error={t('statement/404')} />}
              <div {...gridStyles} style={{ marginBottom: 20 }} ref={this.ref}>
                {items}
              </div>
              {statements.length >= AUTO_INFINITE &&
                  !this.state.endless &&
                  hasMore && (
                    <P {...styles.more}>
                      <A
                        href='#'
                        onClick={(e) => {
                          e.preventDefault()
                          this.setState(
                            () => ({
                              endless: true,
                            }),
                            () => {
                              this.onScroll()
                            }
                          )
                        }}
                      >
                        {t('testimonial/infinite/endless', {
                          count: AUTO_INFINITE,
                          remaining: totalCount - AUTO_INFINITE,
                        })}
                      </A>
                    </P>
                  )}
                {!hasMore && hasEndText && this.state.endless && (
                  <P {...styles.more}>
                    {t('testimonial/infinite/end', {
                      count: statements.length,
                    })}
                  </P>
                )}
              {singleRowOpenItem && (
                <Detail t={t} locale={locale} share={share} data={singleRowOpenItem} />
              )}
            </Fragment>
          )
        }}
      />
    )
  }
}

export const testimonialFields = `
  id
  slug
  name
  statement
  credentials {
    description
  }
  portrait
  updatedAt
  sequenceNumber
`

export const query = gql`
query statements($seed: Float, $search: String, $focus: String, $featuredIds: [ID!], $after: String, $first: Int!, $membershipAfter: DateTime) {
  statements(seed: $seed, search: $search, focus: $focus, featuredIds: $featuredIds, after: $after, first: $first, membershipAfter: $membershipAfter) {
    totalCount
    nodes {
      ${testimonialFields}
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`

export const ListWithQuery = compose(
  withT,
  graphql(query, {
    options: ({ ssr }) => ({
      ssr,
    }),
    props: ({ data }) => {
      return {
        loading: data.loading,
        error: data.error,
        totalCount: data.statements && data.statements.totalCount,
        statements: data.statements && data.statements.nodes,
        hasMore: data.statements && data.statements.pageInfo.hasNextPage,
        loadMore() {
          return data.fetchMore({
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const nodes = [
                ...previousResult.statements.nodes,
                ...fetchMoreResult.statements.nodes,
              ]
              return {
                ...fetchMoreResult,
                statements: {
                  ...fetchMoreResult.statements,
                  nodes: nodes.filter(
                    ({ id }, index, all) =>
                      index === all.findIndex((node) => node.id === id)
                  ),
                },
              }
            },
            variables: {
              after: data.statements.pageInfo.endCursor,
            },
          })
        },
      }
    },
  })
)(List)

ListWithQuery.defaultProps = {
  seed: null,
  first: 50,
}

export const generateSeed = () => Math.random() * 2 - 1

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { t, id, isPage, router, serverContext } = this.props
    const { query } = this.state

    const seed = this.state.seed || this.props.seed
    const locale = getSafeLocale(router.query.locale)

    return (
      <div>
        <Field
          label={t('testimonial/search/label')}
          name='search'
          value={query}
          autoComplete='off'
          onChange={(_, value) => {
            this.setState(() => ({
              query: value,
            }))
          }}
        />
        <div {...styles.options}>
          <A
            style={{ float: 'right', cursor: 'pointer' }}
            onClick={() => {
              this.setState(() => ({
                seed: generateSeed(),
              }))
              if (isPage && (id || this.state.clearedFocus)) {
                this.setState(
                  {
                    clearedFocus: undefined,
                  },
                  () => {
                    router.replace(`/${locale}/community`, undefined, {
                      shallow: router.pathname === '/[locale]/community',
                    })
                  }
                )
              }
            }}
          >
            {t('testimonial/search/seed')}
          </A>
        </div>
        <br style={{ clear: 'left' }} />
        <ListWithQuery
          isPage={isPage}
          focus={query ? undefined : id || this.state.clearedFocus}
          onSelect={() => {
            if (!id) {
              return
            }
            this.setState(
              {
                // keep it around for the query
                clearedFocus: id,
              },
              () => {
                router.push(`/${locale}/community`, undefined, {
                  shallow: router.pathname === '/[locale]/community',
                })
              }
            )
          }}
          search={query}
          seed={seed}
          locale={locale}
          serverContext={serverContext}
        />
      </div>
    )
  }
}

export default compose(withT, withRouter)(Container)
