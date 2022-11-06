import { gql } from '@apollo/client'
import { graphql } from '@apollo/client/react/hoc'
import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'

import { meQuery } from 'src/components/Auth/withMe'
import { getSafeLocale } from '../../../constants'

const mutation = gql`
  mutation authorizeSession(
    $email: String!
    $tokens: [SignInToken!]!
    $consents: [String!]
    $requiredFields: RequiredUserFields
    $locale: Locale
  ) {
    authorizeSession(
      email: $email
      tokens: $tokens
      consents: $consents
      requiredFields: $requiredFields
      locale: $locale
    )
  }
`

export default compose(
  withRouter,
  graphql(mutation, {
    props: ({ mutate, ownProps: { router } }) => ({
      authorizeSession: (variables) =>
        mutate({
          variables: {
            ...variables,
            locale: getSafeLocale(router.query.locale),
          },
          refetchQueries: [{ query: meQuery }],
          awaitRefetchQueries: true,
        }),
    }),
  })
)
