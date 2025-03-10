import { generateAlphanumId_withCheck } from '@moodle/lib-id-gen'
import * as E from 'fp-ts/Either'
import { SUBMITTED } from '../../../../../../lib/constants'
import { NONE_ASSET } from '../../../../../../lib/content/asset'
import { INVALID_TOKEN } from '../../../../../model/jwtTokens.model'
import { userAccountRecord } from '../../../../../model/userAccount.model/userAccount.model'
import type * as def from './confirmMyEmail.endpoint'

export const confirmMyEmail: moo.core.endpoint<def.confirmMyEmail> = async (confirmEmailForm, { model, coreRequest }) => {
  const e_validatedToken = await model.jwtTokens.model.userAccount.emailConfirmationToken.validate.query({
    token: confirmEmailForm.signupEmailVerificationToken,
  })

  if (E.isLeft(e_validatedToken)) {
    return e_validatedToken
  }

  const confirmationTokenData = e_validatedToken.right.data

  const {
    items: [existingUserWithThisEmail],
  } = await model.userAccount.user.find.query({
    filter: { by: 'id', email: confirmationTokenData.email },
  })

  if (!existingUserWithThisEmail) {
    return E.left(INVALID_TOKEN)
  }

  // TODO: mv userAccount creation as userAccount model endpoint
  const userId = await generateAlphanumId_withCheck(generated_id =>
    model.userAccount.user.find.query({ filter: { by: 'id', userId: generated_id } }).then(({ items }) => items.length === 0),
  )

  const userAccountRecord: userAccountRecord = {
    userId,
    createdDate: coreRequest.now,
    email: { address: confirmationTokenData.email },
    password: { hash: confirmationTokenData.passwordHash },
    profile: {
      info: {
        displayName: confirmationTokenData.displayName,
      },
      avatar: NONE_ASSET,
      background: NONE_ASSET,
    },
  }

  await model.userAccount.user.create.async({ record: userAccountRecord })

  return E.right(SUBMITTED)
}
