import { MoodleNet } from '../..'
import { ApiReturn } from '../../../lib/domain/api/types'
import { v4 } from 'uuid'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { getEmailPersistence } from './email.env'
import { EmailObj } from './types'

getEmailPersistence().then(async (emailPersistence) => {
  await MoodleNet.respondApi({
    api: 'Email.Verify_Email.Req',
    async handler({ req, flow }): ApiReturn<MoodleNetDomain, 'Email.Verify_Email.Req'> {
      const { email, tokenReplaceRegEx } = req
      const token = v4()
      const regex = new RegExp(tokenReplaceRegEx, 'g')
      const emailObj: EmailObj = {
        ...email,
        html: email.html?.replace(regex, token),
        text: email.text?.replace(regex, token),
      }
      const documentKey = await emailPersistence.storeVerifyingEmail({
        req: {
          ...req,
          email: emailObj,
        },
        flow,
        token,
      })
      MoodleNet.callApi({
        api: 'Email.Verify_Email.Attempt_Send',
        req: {},
        flow: flow,
      })
      return { id: documentKey }
    },
  })
})
