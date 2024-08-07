import { Fragment } from 'react'
import compose from 'lodash/flowRight'

import withMe from 'src/components/Auth/withMe'
import { withT } from 'src/components/Message'

import SignIn from './SignIn'
import SignOut from './SignOut'

import { Interaction } from '@project-r/styleguide'

const Me = ({ me, t, email, beforeSignInForm, beforeSignedInAs }) =>
  me ? (
    <Fragment>
      {beforeSignedInAs}
      <Interaction.P>
        {t('me/signedinAs', {
          nameOrEmail: me.name ? `${me.name.trim()} (${me.email})` : me.email,
        })}
      </Interaction.P>
      <SignOut />
    </Fragment>
  ) : (
    <SignIn email={email} beforeForm={beforeSignInForm} />
  )

export default compose(withMe, withT)(Me)
