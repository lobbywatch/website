import { Component } from 'react'
import compose from 'lodash/flowRight'
import { css } from 'glamor'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'

import { withT } from 'src/components/Message'
import AddressForm, {
  DEFAULT_COUNTRY,
  fields as addressFields,
  isEmptyAddress,
} from '../AddressForm'

import FieldSet from '../../FieldSet'
import {
  Loader,
  InlineSpinner,
  Interaction,
  Label,
  Button,
  colors,
  errorToString,
  intersperse,
  timeParse,
} from '@project-r/styleguide'

import { Hint, EditButton } from '../Elements'
import withMe from 'src/components/Auth/withMe'
import belongingsQuery from '../belongingsQuery'

const mutation = gql`
  mutation updateMe(
    $birthday: Date
    $firstName: String
    $lastName: String
    $phoneNumber: String
    $address: AddressInput
  ) {
    updateMe(
      birthday: $birthday
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      address: $address
    ) {
      id
      birthday
      name
      firstName
      lastName
      phoneNumber
      address {
        name
        line1
        line2
        postalCode
        city
        country
      }
    }
  }
`

const { P, Emphasis } = Interaction

const birthdayFormat = '%d.%m.%Y'
const birthdayParse = timeParse(birthdayFormat)

const styles = {
  buttonsContainer: css({
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  }),
}

const fields = (t) => [
  {
    label: t('pledge/contact/firstName/label'),
    name: 'firstName',
    validator: (value) =>
      value.trim().length <= 0 && t('pledge/contact/firstName/error/empty'),
  },
  {
    label: t('pledge/contact/lastName/label'),
    name: 'lastName',
    validator: (value) =>
      value.trim().length <= 0 && t('pledge/contact/lastName/error/empty'),
  },
  {
    label: t('Account/Update/phone/label'),
    name: 'phoneNumber',
  },
  {
    label: t('Account/Update/birthday/label/optional'),
    name: 'birthday',
    mask: '11.11.1111',
    maskChar: '_',
    validator: (value) => {
      const parsedDate = birthdayParse(value)
      return (
        !!value.trim().length &&
        (parsedDate === null ||
          parsedDate > new Date() ||
          parsedDate < new Date(1798, 3, 12)) &&
        t('Account/Update/birthday/error/invalid')
      )
    },
  },
]

const getValues = (me) => {
  let addressState = {}
  if (me.address) {
    addressState = {
      name: me.address.name || me.name,
      line1: me.address.line1,
      line2: me.address.line2,
      postalCode: me.address.postalCode,
      city: me.address.city,
      country: me.address.country,
    }
  } else if (me) {
    addressState.name = [me.firstName, me.lastName].filter(Boolean).join(' ')
  }

  return {
    firstName: me.firstName || '',
    lastName: me.lastName || '',
    phoneNumber: me.phoneNumber || '',
    birthday: me.birthday || '',
    ...addressState,
  }
}

const UserNameAddress = withT(({ t, detailsData }) => {
  const { loading, error, me } = detailsData
  return (
    <Loader
      loading={loading || (!me && !error)}
      error={error}
      render={() => (
        <div>
          <Label>{t('Account/Update/name/label')}</Label>
          <P style={{ marginBottom: 8 }}>
            {intersperse([me.name, me.phoneNumber].filter(Boolean), (_, i) => (
              <br key={i} />
            ))}
          </P>
          {!!me.birthday && (
            <>
              <Label>{t('Account/Update/birthday/label')}</Label>
              <P style={{ marginBottom: 8 }}>{me.birthday}</P>
            </>
          )}
          {!!me.address && (
            <>
              <Label>{t('Account/Update/address/label')}</Label>
              <P>
                {intersperse(
                  [
                    me.address.name,
                    me.address.line1,
                    me.address.line2,
                    `${me.address.postalCode} ${me.address.city}`,
                    me.address.country,
                  ].filter(Boolean),
                  (_, i) => (
                    <br key={i} />
                  )
                )}
              </P>
            </>
          )}
        </div>
      )}
    />
  )
})

class UpdateMe extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      showErrors: false,
      values: {
        country: DEFAULT_COUNTRY,
      },
      errors: {},
      dirty: {},
    }
  }
  startEditing() {
    const {
      detailsData: { me },
    } = this.props
    this.setState((state) => ({
      isEditing: true,
      values: {
        ...state.values,
        ...getValues(me),
      },
    }))
  }
  stopEditing() {
    this.setState({
      isEditing: false,
    })
  }
  autoEdit() {
    if (!this.checked && this.props.detailsData.me) {
      this.checked = true
      const {
        t,
        detailsData: { me },
      } = this.props

      const errors = FieldSet.utils.getErrors(
        fields(t).concat(me.address ? addressFields(t) : []),
        getValues(me)
      )

      const errorMessages = Object.keys(errors)
        .map((key) => errors[key])
        .filter(Boolean)

      console.log(me, this.props.detailsData)
      if (errorMessages.length || (!me.address && me.pledges?.length)) {
        this.startEditing()
      }
    }
  }
  componentDidMount() {
    this.autoEdit()
  }
  componentDidUpdate() {
    this.autoEdit()
  }
  render() {
    const { t, detailsData, style } = this.props
    const { values, dirty, updating, isEditing, errors } = this.state
    const { loading, error, me } = detailsData

    return (
      <Loader
        loading={loading || (!me && !error)}
        error={error}
        render={() => {
          const meFields = fields(t)
          let errorFilter = () => true
          if (!me.address && isEmptyAddress(values, me)) {
            errorFilter = (key) => meFields.find((field) => field.name === key)
          }

          const errorMessages = Object.keys(errors)
            .filter(errorFilter)
            .map((key) => errors[key])
            .filter(Boolean)

          return (
            <div style={style}>
              {!isEditing ? (
                <div>
                  <UserNameAddress detailsData={detailsData} />
                  <EditButton onClick={() => this.startEditing()}>
                    {t('Account/Update/edit')}
                  </EditButton>
                </div>
              ) : (
                <div>
                  <Label>
                    <Emphasis>{t('Account/Update/name/label')}</Emphasis>
                  </Label>
                  <div style={{ margin: '8px 0 36px' }}>
                    <FieldSet
                      values={values}
                      errors={errors}
                      dirty={dirty}
                      onChange={(fields) => {
                        this.setState(FieldSet.utils.mergeFields(fields))
                      }}
                      fields={meFields}
                    />
                    <Hint t={t} tKey={'Account/Update/birthday/hint/plain'} />
                  </div>
                  <Label>
                    <Emphasis>{t('Account/Update/address/label')}</Emphasis>
                  </Label>
                  <div style={{ margin: '8px 0 0' }}>
                    <AddressForm
                      values={values}
                      errors={errors}
                      dirty={dirty}
                      onChange={(fields) => {
                        this.setState(FieldSet.utils.mergeFields(fields))
                      }}
                    />
                  </div>
                  {updating ? (
                    <div style={{ textAlign: 'center' }}>
                      <InlineSpinner />
                      <br />
                      {t('Account/Update/updating')}
                    </div>
                  ) : (
                    <div>
                      {!!this.state.showErrors && errorMessages.length > 0 && (
                        <div style={{ color: colors.error, marginBottom: 40 }}>
                          {t('pledge/submit/error/title')}
                          <br />
                          <ul>
                            {errorMessages.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {!!this.state.error && (
                        <div style={{ color: colors.error, marginBottom: 40 }}>
                          {this.state.error}
                        </div>
                      )}
                      <div
                        {...styles.buttonsContainer}
                        style={{ opacity: errorMessages.length ? 0.5 : 1 }}
                      >
                        <Button
                          primary
                          onClick={() => {
                            if (errorMessages.length) {
                              this.setState((state) =>
                                Object.keys(state.errors).reduce(
                                  (nextState, key) => {
                                    nextState.dirty[key] = true
                                    return nextState
                                  },
                                  {
                                    showErrors: true,
                                    dirty: {},
                                  }
                                )
                              )
                              return
                            }
                            this.setState(() => ({ updating: true }))

                            this.props
                              .updateDetails({
                                firstName: values.firstName,
                                lastName: values.lastName,
                                phoneNumber: values.phoneNumber,
                                birthday:
                                  values.birthday && values.birthday.length
                                    ? values.birthday.trim()
                                    : null,
                                address: isEmptyAddress(values, me)
                                  ? undefined
                                  : {
                                      name: values.name,
                                      line1: values.line1,
                                      line2: values.line2,
                                      postalCode: values.postalCode,
                                      city: values.city,
                                      country: values.country,
                                    },
                              })
                              .then(() => {
                                this.setState(() => ({
                                  updating: false,
                                  isEditing: false,
                                }))
                              })
                              .catch((error) => {
                                this.setState(() => ({
                                  updating: false,
                                  error: errorToString(error),
                                }))
                              })
                          }}
                        >
                          {t('Account/Update/submit')}
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            this.stopEditing()
                          }}
                        >
                          {t('Account/Update/cancel')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        }}
      />
    )
  }
}

export default compose(
  withMe,
  graphql(belongingsQuery, {
    name: 'detailsData',
  }),
  graphql(mutation, {
    props: ({ mutate }) => ({
      updateDetails: (variables) =>
        mutate({
          variables,
        }),
    }),
  }),
  withT
)(UpdateMe)
