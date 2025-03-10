import * as E from 'fp-ts/Either'
import * as duration from 'iso8601-duration'
import { SUBMITTED } from '../../../../../../lib/constants'
import type * as def from './submitSignupForm.endpoint'

export const submitSignupForm: moo.core.endpoint<def.submitSignupForm> = async (form, { model }) => {
  const {
    items: [existingUser],
  } = await model.userAccount.user.find.query({ filter: { by: 'id', email: form.email } })

  if (existingUser) {
    return E.right(SUBMITTED)
    // return E.left(USER_WITH_THIS_EMAIL_EXISTS)
  }

  const { emailConfirmationTokenExpires } = await model.configs.model.userAccount.get.query()
  const expires = duration.end(duration.parse(emailConfirmationTokenExpires)).toISOString()

  const { hash: passwordHash } = await model.crypto.hashing.password.hash.query({
    plainPassword: form.password,
  })

  const { token: confirmationToken } = await model.jwtTokens.model.userAccount.emailConfirmationToken.sign.query({
    data: { displayName: form.displayName, email: form.email, passwordHash },
    expires,
  })

  const { body, subject } = await model.mailer.template.userAccount.userEmailConfirmation.query({
    data: {
      displayName: form.displayName,
      confirmationToken,
    },
  })

  await model.mailer.send.async({
    envelope: {
      body,
      subject,
      to: [form.email],
    },
  })

  return E.right(SUBMITTED)
}
