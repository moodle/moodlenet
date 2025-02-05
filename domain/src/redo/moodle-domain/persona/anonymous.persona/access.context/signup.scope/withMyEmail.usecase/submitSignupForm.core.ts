import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as moo from 'moodle-domain'
import { SUBMITTED } from '../../../../../../lib/constants'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
import { submitSignupForm } from './submitSignupForm.endpoint'

export const submitSignupFormCore: moo.Core_Endpoint<submitSignupForm> = async (signupForm, _) => {
  const existingUser = await _.over(_.model.userAccount.user).one.query({ filters: { emailEquals: signupForm.email } })

  if (!O.isNone(existingUser)) {
    return E.left(USER_WITH_THIS_EMAIL_EXISTS)
  }

  const { hash: passwordHash } = await _.over(_.model.crypto.hashing.password.hash).call.query({
    plainPassword: signupForm.password,
  })

  const { token } = await _.over(_.model.crypto.serviceToken.emailSignup.emailConfirmationToken.sign).call.query({
    data: { displayName: signupForm.displayName, email: signupForm.email, passwordHash },
  })

  await _.over(_.model.mailer.send).call.async({ displayName: signupForm.displayName, email: signupForm.email, token })

  return E.right(SUBMITTED)
}
