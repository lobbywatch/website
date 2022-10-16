import { Component } from 'react'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { css, merge } from 'glamor'

import Loader from '../Loader'

import { Interaction, RawHtml, colors, fontStyles, useColorContext } from '@project-r/styleguide'

import { HEADER_HEIGHT } from 'src/theme'

import { nest } from 'd3-collection'

const { P } = Interaction

const styles = {
  category: css({
    marginBottom: 40,
  }),
  title: css({
    marginBottom: 20,
  }),
  faq: css({
    padding: '10px 0',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottom: `1px solid ${colors.divider}`,
  }),
  faqAnchor: css({
    display: 'block',
    visibility: 'hidden',
    position: 'relative',
    top: -(HEADER_HEIGHT + 5),
  }),
  question: css({
    cursor: 'pointer',
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
    },
  }),
  answer: css({
    paddingBottom: 10,
    margin: '20px 0 40px 0',
  }),
  active: css({
    ...fontStyles.sansSerifMedium,
    marginBottom: 10,
  }),
}

export const H2 = ({ children }) => (
  <Interaction.H2 {...styles.title}>{children}</Interaction.H2>
)

const AnswerP = (args) => <P {...args} {...styles.answer} />

const slug = (string) =>
  string
    .toLowerCase()
    .replace(/[^0-9a-zäöü]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-')

const Faq = ({ faq, active, onClick }) => {
  const [colorScheme] = useColorContext()
  return (
    <div {...styles.faq} {...colorScheme.set('borderBottomColor', 'divider')}>
      <a {...styles.faqAnchor} id={slug(faq.question)} />
      <P {...merge(styles.question, active && styles.active)}>
        <a
          href={`#${slug(faq.question)}`}
          onClick={onClick}
        >
          {faq.question}
        </a>
      </P>
      {active && (
        <RawHtml
          type={AnswerP}
          dangerouslySetInnerHTML={{
            __html: faq.answer.split('\n').join('<br />'),
          }}
        />
      )}
    </div>
  )
}

export class RawList extends Component {
  constructor(...args) {
    super(...args)

    this.state = {}
  }
  componentDidMount() {
    if (window.location.hash) {
      this.setState(() => ({
        [window.location.hash.replace(/^#/, '')]: true,
      }))
    }
  }
  render() {
    const {
      data: { loading, error, faqs },
    } = this.props
    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          const faqsByCategory = nest()
            .key((d) => d.category)
            .entries(faqs)

          return (
            <div>
              {faqsByCategory.map(({ key: title, values }) => (
                <div {...styles.category} key={title}>
                  <H2>{title}</H2>
                  {values.map((faq, i) => {
                    const active = this.state[slug(faq.question)]

                    return <Faq key={i} faq={faq} active={active} onClick={(e) => {
                      e.preventDefault()
                      this.setState(() => ({
                        [slug(faq.question)]: !active,
                      }))
                    }} />
                  })}
                </div>
              ))}
            </div>
          )
        }}
      />
    )
  }
}

const publishedFaqs = gql`
  query FaqList($locale: Locale!) {
    faqs(locale: $locale) {
      category
      question
      answer
    }
  }
`

export default graphql(publishedFaqs)(RawList)
