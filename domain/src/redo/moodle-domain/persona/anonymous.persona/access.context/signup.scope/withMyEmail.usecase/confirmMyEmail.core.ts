import { generateAlphanumId_withCheck } from '@moodle/lib-id-gen'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { userSpace } from '../../../../../model/userAccount.model/userAccount.model'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
import type * as def from './confirmMyEmail.endpoint'
import { NONE_ASSET } from '../../../../../../moo/lib/content/asset'
import { SUBMITTED } from '../../../../../../moo/lib/constants'

export const confirmMyEmail: moo.core.endpoint<def.confirmMyEmail> = async ({ form: confirmEmailForm, ctx: _ }) => {
  const e_validatedToken = await _.over(
    _.model.jwtTokens.anonymous.access.signup.withMyEmail.emailConfirmationToken.validate,
  ).call.query({
    token: confirmEmailForm.signupEmailVerificationToken,
  })

  if (E.isLeft(e_validatedToken)) {
    return e_validatedToken
  }

  const confirmationTokenData = e_validatedToken.right.data

  const o_existingUserWithThisEmail = await _.over(_.model.userAccount.user).one.query({
    filters: { emailEquals: confirmationTokenData.email },
  })

  if (O.isSome(o_existingUserWithThisEmail)) {
    return E.left(USER_WITH_THIS_EMAIL_EXISTS)
  }

  const id = await generateAlphanumId_withCheck(generated_id =>
    _.over(_.model.userAccount.user[generated_id])
      .exists.query()
      .then(({ exists }) => exists),
  )

  const userSpace: moo.model.type.spaceData<userSpace> = {
    email: { address: confirmationTokenData.email },
    password: { hash: confirmationTokenData.passwordHash },
    profile: {
      info: {
        displayName: confirmationTokenData.displayName,
      },
      avatar: NONE_ASSET,
      background: NONE_ASSET,
    },
    session: {
      personaTypes: {
        types: ['any', 'authenticated'],
      },
    },
  }

  await _.over(_.model.userAccount.user[id]).create.async({ spaceData: userSpace })

  return E.right(SUBMITTED)
}
