import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
import { submitSignupForm } from './submitSignupForm.endpoint'
import { SUBMITTED } from '../../../../../../moo/lib/constants'

export const submitSignupFormCore: moo.core.endpoint<submitSignupForm> = async (signupForm, _) => {
  const existingUser = await _.over(_.model.userAccount.user).one.query({ filters: { emailEquals: signupForm.email } })

  if (!O.isNone(existingUser)) {
    return E.left(USER_WITH_THIS_EMAIL_EXISTS)
  }

  const { hash: passwordHash } = await _.over(_.model.crypto.hashing.password.hash).call.query({
    plainPassword: signupForm.password,
  })

  const { token } = await _.over(
    _.model.jwtTokens.anonymous.access.signup.withMyEmail.emailConfirmationToken.sign,
  ).call.query({
    data: { displayName: signupForm.displayName, email: signupForm.email, passwordHash },
  })

  await _.over(_.model.mailer.send.anonymous.access.signup.withMyEmail.userEmailConfirmation).call.async({
    data: {
      displayName: signupForm.displayName,
      confirmationToken: token,
    },
    envelope: { to: [signupForm.email] },
  })

  return E.right(SUBMITTED)
}
