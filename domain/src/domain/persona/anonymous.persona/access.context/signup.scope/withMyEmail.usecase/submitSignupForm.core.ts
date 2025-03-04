import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as duration from 'iso8601-duration'
import { SUBMITTED } from '../../../../../../lib/constants'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
import type * as def from './submitSignupForm.endpoint'

export const submitSignupForm: moo.core.endpoint<def.submitSignupForm> = async (form, _) => {
  const existingUser = await _.over(_.model.userAccount.userAccountSpace).one.query({ filters: { emailEquals: form.email } })

  if (!O.isNone(existingUser)) {
    return E.left(USER_WITH_THIS_EMAIL_EXISTS)
  }

  const { emailConfirmationTokenExpires } = await _.over(_.model.configs.module.userAccount).get.query()
  const { hash: passwordHash } = await _.over(_.model.crypto.hashing.password.hash).call.query({
    plainPassword: form.password,
  })
  const expires = duration.end(duration.parse(emailConfirmationTokenExpires)).toISOString()

  const { token } = await _.over(_.model.jwtTokens.token.userAccount.emailConfirmationToken.sign).call.query({
    data: { displayName: form.displayName, email: form.email, passwordHash },
    expires,
  })

  const { body, subject } = await _.over(_.model.mailer.template.userAccount.userEmailConfirmation).call.query({
    data: {
      displayName: form.displayName,
      confirmationToken: token,
    },
  })
  await _.over(_.model.mailer.send).call.async({
    envelope: {
      body,
      subject,
      to: [form.email],
    },
  })

  return E.right(SUBMITTED)
}
