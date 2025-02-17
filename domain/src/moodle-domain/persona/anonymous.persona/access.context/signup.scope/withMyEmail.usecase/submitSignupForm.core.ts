import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
import type * as def from './submitSignupForm.endpoint'
import { SUBMITTED } from '../../../../../../moo/lib/constants'

export const submitSignupForm: moo.core.endpoint<def.submitSignupForm> = async ({ ctx }) => {
  const existingUser = await ctx.over(ctx.model.userAccount.user).one.query({ filters: { emailEquals: ctx.form.email } })

  if (!O.isNone(existingUser)) {
    return E.left(USER_WITH_THIS_EMAIL_EXISTS)
  }

  const { hash: passwordHash } = await ctx.over(ctx.model.crypto.hashing.password.hash).call.query({
    plainPassword: ctx.form.password,
  })

  const { token } = await ctx
    .over(ctx.model.jwtTokens.anonymous.access.signup.withMyEmail.emailConfirmationToken.sign)
    .call.query({
      data: { displayName: ctx.form.displayName, email: ctx.form.email, passwordHash },
    })

  await ctx.over(ctx.model.mailer.send.anonymous.access.signup.withMyEmail.userEmailConfirmation).call.async({
    data: {
      displayName: ctx.form.displayName,
      confirmationToken: token,
    },
    envelope: { to: [ctx.form.email] },
  })

  return E.right(SUBMITTED)
}
