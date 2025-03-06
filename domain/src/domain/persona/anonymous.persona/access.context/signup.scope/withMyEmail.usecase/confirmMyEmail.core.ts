import { generateAlphanumId_withCheck } from '@moodle/lib-id-gen'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { userAccountUserSpace } from '../../../../../model/userAccount.model/userAccount.model'
import type * as def from './confirmMyEmail.endpoint'
import { NONE_ASSET } from '../../../../../../lib/content/asset'
import { SUBMITTED } from '../../../../../../lib/constants'
import { INVALID_TOKEN } from '../../../../../model/jwtTokens.model'

export const confirmMyEmail: moo.core.endpoint<def.confirmMyEmail> = async (confirmEmailForm, _) => {
  const e_validatedToken = await _.over(_.model.jwtTokens.model.userAccount.emailConfirmationToken.validate).call.query({
    token: confirmEmailForm.signupEmailVerificationToken,
  })

  if (E.isLeft(e_validatedToken)) {
    return e_validatedToken
  }

  const confirmationTokenData = e_validatedToken.right.data

  const o_existingUserWithThisEmail = await _.over(_.model.userAccount.userAccountSpace).one.query({
    filters: { emailEquals: confirmationTokenData.email },
  })

  if (O.isSome(o_existingUserWithThisEmail)) {
    return E.left(INVALID_TOKEN)
  }

  // TODO: mv userAccount creation as userAccount model endpoint
  const userId = await generateAlphanumId_withCheck(generated_id =>
    _.over(_.model.userAccount.userAccountSpace[generated_id])
      .exists.query()
      .then(({ exists }) => exists),
  )

  const userSpace: moo.model.type.sSpaceData<userAccountUserSpace> = {
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

  await _.over(_.model.userAccount.userAccountSpace[userId]).create.async({ spaceData: userSpace })

  return E.right(SUBMITTED)
}
