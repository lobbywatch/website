import { graphql } from '@apollo/client/react/hoc'
import { gql, useQuery } from '@apollo/client'

export const checkRoles = (me, roles) => {
  return !!(
    me &&
    (!roles ||
      (me.roles && me.roles.some((role) => roles.indexOf(role) !== -1)))
  )
}

export const meQuery = gql`
  query me {
    me {
      id
      username
      portrait
      name
      firstName
      lastName
      email
      initials
      roles
      isListed
      hasPublicProfile
      prolongBeforeDate
      activeMembership {
        id
        type {
          name
        }
        endDate
        graceEndDate
      }
    }
  }
`

export const useMe = () => {
  const { loading, error, data: { me, refetch } = {} } = useQuery(meQuery)

  return {
    me,
    meRefetch: refetch,
    meLoading: loading,
    meError: error,
    hasActiveMembership: !!me?.activeMembership,
    hasAccess: checkRoles(me, ['member']),
  }
}

const createWithMe = (Component) => {
  const WithMe = (props) => {
    const meProps = useMe()
    return <Component {...props} {...meProps} />
  }
  return WithMe
} 

export default createWithMe
