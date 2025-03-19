import { generateAlphanumId_withCheck } from '@moodle/lib-id-gen'
import * as E from 'fp-ts/Either'
import { SUBMITTED } from '../../../../../../lib/constants'
import { NONE_ASSET } from '../../../../../../lib/content/asset'
import { idConfirmedEmailEntry } from '../../../../../model/idConfirmedEmail.model'
import { INVALID_TOKEN } from '../../../../../model/signedTokens.model'
import { userHomeRecord } from '../../../../../model/userHome.model/userHome.model'
import { confirmMyEmail as confirmMyEmail_def } from './confirmMyEmail.endpoint'

export const confirmMyEmail: moo.def.core.endpoint<confirmMyEmail_def> = async (confirmEmailForm, { model, coreRequest }) => {
  const e_validatedToken = await model.signedTokens.validate.query({
    ns: 'idConfirmedEmail',
    type: 'emailConfirmationToken',
    token: confirmEmailForm.signupEmailVerificationToken,
  })

  if (E.isLeft(e_validatedToken)) {
    return e_validatedToken
  }

  const confirmationTokenData = e_validatedToken.right.data

  const {
    items: [existingUserWithThisEmail],
  } = await model.userHome.find.query({ filters: [{ by: 'id', type: 'email', email: confirmationTokenData.email }] })

  if (!existingUserWithThisEmail) {
    return E.left(INVALID_TOKEN)
  }

  // TODO: mv userHome creation as userHome model endpoint
  const userId = await generateAlphanumId_withCheck(generated_id =>
    model.userHome.find.query({ filters: [{ by: 'id', type: 'userId', userId: generated_id }] }).then(({ items }) => items.length === 0),
  )
  const idConfirmedEmailEntry: idConfirmedEmailEntry = {
    email: { address: confirmationTokenData.email },
    password: { hash: confirmationTokenData.passwordHash },
  }
  const userHomeRecord: userHomeRecord = {
    userId,
    createdDate: coreRequest.now,
    email: { address: confirmationTokenData.email },
    profile: {
      info: {
        displayName: confirmationTokenData.displayName,
      },
      avatar: NONE_ASSET,
      background: NONE_ASSET,
    },
  }

  await model.userHome.create.async({ id: ['idConfirmedEmail', idConfirmedEmailEntry], userHomeRecord })

  return E.right(SUBMITTED)
}
