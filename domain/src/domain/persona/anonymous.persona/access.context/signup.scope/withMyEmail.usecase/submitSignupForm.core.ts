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

  const { token } = await _.over(_.model.jwtTokens.token.userAccount.emailConfirmationToken.sign).call.query({
    data: { displayName: form.displayName, email: form.email, passwordHash },
  })

  const { body } = await _.over(_.model.mailer.template.userAccount.userEmailConfirmation).call.query({
    data: {
      displayName: form.displayName,
      confirmationToken: token,
    },
  })
  await _.over(_.model.mailer.send).call.async({
    envelope: {
      body,
      subject: '',
      to: [form.email],
    },
  })

  return E.right(SUBMITTED)
}
