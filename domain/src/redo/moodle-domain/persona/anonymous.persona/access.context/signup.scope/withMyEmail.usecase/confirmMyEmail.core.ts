import { generateAlphanumId_withCheck } from '@moodle/lib-id-gen'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as moo from 'moodle-domain'
import { SUBMITTED } from '../../../../../../lib/constants'
import { userSpace } from '../../../../../service/userAccount.service/userAccount.service'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
import { confirmMyEmail } from './confirmMyEmail.endpoint'

export const confirmMyEmailCore: moo.Core_Endpoint<confirmMyEmail> = async (confirmEmailForm, _) => {
  const e_validatedToken = await _.over(_.model.crypto.serviceToken.emailSignup.emailConfirmationToken.validate).call.query({
    token: confirmEmailForm.signupEmailVerificationToken,
  })

  if (E.isLeft(e_validatedToken)) {
    return e_validatedToken
  }

  const confirmationTokenData = e_validatedToken.right.data

  const existingUserWithThisEmail = await _.over(_.model.userAccount.user).one.query({
    filters: { emailEquals: confirmationTokenData.email },
  })

  if (O.isSome(existingUserWithThisEmail)) {
    return E.left(USER_WITH_THIS_EMAIL_EXISTS)
  }

  const id = await generateAlphanumId_withCheck(generated_id =>
    _.over(_.model.userAccount.user[generated_id])
      .exists.query()
      .then(({ exists }) => exists),
  )

  const userSpace: moo.SpaceData<userSpace> = {
    email: { address: confirmationTokenData.email },
    password: { hash: confirmationTokenData.passwordHash },
    profile: {
      info: {
        displayName: confirmationTokenData.displayName,
      },
      avatar: { type: 'none' },
      background: { type: 'none' },
    },
  }

  await _.over(_.model.userAccount.user[id]).create.async({ spaceData: userSpace })

  return E.right(SUBMITTED)
}
