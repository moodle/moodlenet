import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
import type * as def from './submitSignupForm.endpoint'
import { SUBMITTED } from '../../../../../../lib/constants'

export const submitSignupForm: moo.core.endpoint<def.submitSignupForm> = async (form, _) => {
  const existingUser = await _.over(_.model.userAccount.user).one.query({ filters: { emailEquals: form.email } })

  if (!O.isNone(existingUser)) {
    return E.left(USER_WITH_THIS_EMAIL_EXISTS)
  }

  const { hash: passwordHash } = await _.over(_.model.crypto.hashing.password.hash).call.query({
    plainPassword: form.password,
  })

  const { token } = await _.over(
    _.model.jwtTokens.useCase.anonymous.access.signup.withMyEmail.emailConfirmationToken.sign,
  ).call.query({
    data: { displayName: form.displayName, email: form.email, passwordHash },
  })

  await _.over(_.model.mailer.sendUseCase.anonymous.access.signup.withMyEmail.userEmailConfirmation).call.async({
    data: {
      displayName: form.displayName,
      confirmationToken: token,
    },
    envelope: { to: [form.email] },
  })

  return E.right(SUBMITTED)
}
