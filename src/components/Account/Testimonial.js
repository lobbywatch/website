import React, { Component } from 'react'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import Link from 'next/link'

import { withT } from 'src/components/Message'

import ErrorMessage from '../ErrorMessage'
import Loader from '../Loader'

import { Item } from '../Testimonial/List'
import Detail from '../Testimonial/Detail'

import {
  Interaction,
  Button,
  A,
  InlineSpinner,
  RawHtml,
} from '@project-r/styleguide'
import FieldSet from '../FieldSet'
import { withRouter } from 'next/router'
import { getSafeLocale } from '../../../constants'

const { H2, P } = Interaction

const fields = (t) => [
  {
    label: t('testimonial/role/label'),
    name: 'role',
  },
  {
    label: t('testimonial/quote/label'),
    name: 'quote',
    autoSize: true,
    validator: (value) =>
      (!value.trim() && t('testimonial/quote/error')) ||
      (value.trim().length >= 140 && t('testimonial/quote/tooLong')),
  },
]

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new window.FileReader()
    fileReader.addEventListener('load', (event) => {
      const url = event.target.result

      // Strip out the information about the mime type of the file and the encoding
      // at the beginning of the file (e.g. data:image/gif;base64,).
      const content = url.replace(/^(.+,)/, '')

      resolve({
        filename: file.name,
        url,
        content,
      })
    })

    fileReader.addEventListener('error', (error) => {
      reject(error)
    })

    fileReader.readAsDataURL(file)
  })
}

class Testimonial extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitting: false,
      serverError: undefined,
      imageError: undefined,
      success: false,
      values: {},
      errors: {},
      dirty: {},
    }
  }
  onFile(e) {
    const { t } = this.props
    const file = e.target.files[0]
    if (file.type.indexOf('image/') === 0) {
      if (file.size > 10.5 * 1024 * 1024) {
        this.setState({
          imageError: t('testimonial/pickImage/tooBig'),
        })
        return
      }
      this.setState({
        imageError: '',
      })
      readFile(file)
        .then(({ content, url, filename }) => {
          this.setState({
            image: {
              content,
              url,
            },
          })
        })
        .catch(() => {
          this.setState({
            imageError: t('testimonial/pickImage/readError'),
          })
        })
    } else {
      this.setState({
        imageError: t('testimonial/pickImage/invalidType'),
      })
    }
  }
  submit() {
    const { values, image } = this.state

    this.setState({
      submitting: true,
      success: false,
      serverError: undefined,
    })

    this.props
      .submit({
        role: values.role,
        quote: values.quote,
        image: image ? image.content : undefined,
      })
      .then(() => {
        this.setState({
          submitting: false,
          success: true,
          image: undefined,
          dirty: {},
        })
      })
      .catch((error) => {
        this.setState({
          submitting: false,
          serverError: error,
        })
      })
  }
  updateFields(props) {
    this.setState((state) => {
      const { meWithTestimonial } = props
      const values = {
        ...state.values,
        quote: meWithTestimonial?.statement || '',
        role: meWithTestimonial?.credentials?.find(c => c.isListed)?.description || '',
      }
      const errors = FieldSet.utils.getErrors(fields(props.t), values)

      return {
        values,
        errors: {
          ...state.errors,
          ...errors,
        },
      }
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.testimonial !== this.props.testimonial) {
      this.updateFields(nextProps)
    }
  }
  componentDidMount() {
    this.updateFields(this.props)
  }
  render() {
    const { t, loading, error, meWithTestimonial, router } = this.props
    const { values, dirty, errors, submitting, serverError, image } =
      this.state
    const locale = getSafeLocale(router.query.locale)

    const imageSrc = image
      ? image.url
      : meWithTestimonial?.portrait || ''
    const imageMissing = !imageSrc && t('testimonial/pickImage/empty')
    const imageError = this.state.imageError || (dirty.image && imageMissing)

    const errorMessages = Object.keys(errors)
      .map((key) => errors[key])
      .concat(imageMissing)
      .filter(Boolean)

    const showDetail = !!(values.quote || '').trim()
    const pickImage = (event) => {
      event.preventDefault()
      this.fileInput.value = null
      this.fileInput.click()
    }

    const isDirty =
      image ||
      Object.keys(dirty)
        .map((key) => dirty[key])
        .filter(Boolean).length

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => (
          <div style={{ marginBottom: 40 }}>
            <H2>{t('testimonial/title')}</H2>
            <RawHtml
              type={P}
              dangerouslySetInnerHTML={{
                __html: t('testimonial/description'),
              }}
            />
            <form
              onSubmit={(event) => {
                event.preventDefault()
                if (errorMessages.length) {
                  this.setState((state) => ({
                    dirty: {
                      ...state.dirty,
                      quote: true,
                      role: true,
                      image: true,
                    },
                  }))
                  return
                }
                this.submit()
              }}
            >
              <br />
              <input
                type='file'
                accept='image/*'
                ref={(ref) => {
                  this.fileInput = ref
                }}
                onChange={(event) => this.onFile(event)}
                style={{ display: 'none' }}
              />
              {!imageSrc && (
                <Button onClick={pickImage}>
                  {t('testimonial/pickImage')}
                </Button>
              )}
              {!!imageSrc && (
                <A href='#' onClick={pickImage}>
                  {t('testimonial/pickImage/update')}
                </A>
              )}
              <br />
              {!!imageError && <ErrorMessage error={imageError} />}
              <br />
              {!!imageSrc && (
                <div>
                  <div style={{ width: 150, float: 'left' }}>
                    <Item
                      style={{
                        width: '100%',
                        marginLeft: -5,
                        cursor: 'default',
                      }}
                      name={meWithTestimonial.name}
                      previewImage={imageSrc}
                      isActive={showDetail}
                    />
                  </div>
                  <div style={{ width: 'calc(100% - 150px)', float: 'left' }}>
                    <FieldSet
                      values={values}
                      errors={errors}
                      dirty={dirty}
                      fields={fields(t)}
                      onChange={(fields) => {
                        this.setState((state) => {
                          const next = FieldSet.utils.mergeFields(fields)(state)
                          if (
                            next.values.quote &&
                            next.values.quote.trim().length
                          ) {
                            next.dirty = {
                              ...next.dirty,
                              quote: true,
                            }
                          }
                          return next
                        })
                      }}
                    />
                  </div>
                  <br style={{ clear: 'both' }} />
                  {showDetail && (
                    <Detail
                      t={t}
                      locale={locale}
                      share={meWithTestimonial.isListed && !isDirty}
                      data={{
                        id: meWithTestimonial.id,
                        name: meWithTestimonial.name,
                        statement: values.quote,
                        credentials: [{
                          isListed: true,
                          description: values.role
                        }],
                      }}
                    />
                  )}
                </div>
              )}
              <br style={{ clear: 'both' }} />
              {meWithTestimonial.isAdminUnlisted && (
                <ErrorMessage error={t('testimonial/adminUnpublished')} />
              )}
              {!!serverError && <ErrorMessage error={serverError} />}
              {!!imageSrc &&
                (submitting ? (
                  <InlineSpinner />
                ) : (
                  <div style={{ opacity: errorMessages.length ? 0.5 : 1 }}>
                    <Button type='submit'>
                      {meWithTestimonial.isListed
                        ? t('testimonial/submit/update')
                        : t('testimonial/submit')}
                    </Button>
                  </div>
                ))}
              {meWithTestimonial.isListed && (
                <div style={{ marginTop: 20 }}>
                  <Link href={`/${locale}/community?id=${meWithTestimonial.id}`} passHref>
                    <A>{t('testimonial/viewLive')}</A>
                  </Link>
                  {' – '}
                  <A
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      this.props.unpublish()
                    }}
                  >
                    {t('testimonial/unpublish')}
                  </A>
                </div>
              )}
              {!meWithTestimonial.isListed && !!meWithTestimonial.statement && (
                <ErrorMessage error={t('testimonial/unpublished')} />
              )}
            </form>
          </div>
        )}
      />
    )
  }
}

const submitMutation = gql`
  mutation submitTestimonial($role: String, $quote: String!, $image: String) {
    publishCredential(description: $role) {
      id
      isListed
      description
      verified
    }
    updateMe(statement: $quote, portrait: $image, isListed: true) {
      id
      portrait
      statement
      isListed
      isAdminUnlisted
      updatedAt
      credentials {
        id
        isListed
        description
        verified
      }
    }
  }
`
const unpublishMutation = gql`
  mutation unpublishTestimonial {
    updateMe(isListed: false) {
      id
      isListed
      updatedAt
    }
  }
`

export const query = gql`
  query myTestimonial {
    me {
      id
      name
      portrait
      statement
      isListed
      isAdminUnlisted
      updatedAt
      credentials {
        isListed
        description
        verified
      }
    }
  }
`

export default compose(
  graphql(unpublishMutation, {
    props: ({ mutate }) => ({
      unpublish: () =>
        mutate({
          refetchQueries: [
            {
              query,
            },
          ],
        }),
    }),
  }),
  graphql(submitMutation, {
    props: ({ mutate }) => ({
      submit: (variables) =>
        mutate({
          variables,
          refetchQueries: [
            {
              query,
            },
          ],
        }),
    }),
  }),
  graphql(query, {
    props: ({ data }) => ({
      loading: data.loading,
      error: data.error,
      meWithTestimonial: data.me,
    }),
  }),
  withT,
  withRouter
)(Testimonial)
