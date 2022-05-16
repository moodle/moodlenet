import { GraphNodeIdentifierAuth } from '@moodlenet/common/dist/content-graph/types/node'
import { newAuthKey, newGlyphPermId } from '@moodlenet/common/dist/utils/content-graph/slug-id'
import { Routes, webappPath } from '@moodlenet/common/dist/webapp/sitemap'
import { fillEmailTemplate } from '../../adapters/emailSender/helpers'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import * as sys from '../system'
import { decryptString, EncryptedString } from '../system/crypto/encrypt'
import { getLatestConfigAdapter } from './adapters'
import { Email } from './types'

export type SignupIssue = 'email not available'

export const signUp = plug(
  ns(module, 'sign-up'),
  async ({ email, displayName, encPassword }: { email: Email; encPassword: EncryptedString; displayName: string }) => {
    const { newUserRequestEmail, newUserVerificationWaitSecs } = await getLatestConfigAdapter()
    // const authId = newAuthKey()
    const authId: GraphNodeIdentifierAuth<'Profile'> = {
      _authKey: newAuthKey(),
      _permId: newGlyphPermId(),
      _type: 'Profile',
    }

    const password = await decryptString(encPassword)
    if (!password) {
      return null
    }
    const hashedPassword = await sys.crypto.passwordHasher.adapter(password)

    const activationEmailToken = await sys.crypto.jwtSigner.adapter(
      {
        displayName,
        email,
        hashedPassword,
        authId,
      },
      newUserVerificationWaitSecs,
    )
    const { publicUrl } = await sys.localOrg.info.adapter()
    const emailObj = fillEmailTemplate({
      template: newUserRequestEmail,
      to: email,
      vars: {
        email,
        link: `${publicUrl}${webappPath<Routes.Login>('/login/:activationEmailToken?', {
          activationEmailToken,
        })}`,
      },
    })
    await sys.sendEmail.adapter(emailObj)
    return { token: activationEmailToken }
  },
)
