import { MoodleNet } from '../../..'
import { ApiReturn } from '../../../../lib/domain/api/types'
import { v4 } from 'uuid'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { getEmailPersistence } from '../email.env'
import { EmailObj } from '../types'
import { fillEmailToken } from '../email.helpers'

getEmailPersistence().then(async (emailPersistence) => {
  await MoodleNet.respondApi({
    api: 'Email.Verify_Email.Req',
    async handler({ req, flow }): ApiReturn<MoodleNetDomain, 'Email.Verify_Email.Req'> {
      const { email } = req
      const token = v4()
      const emailObj: EmailObj = {
        ...email,
        html: email.html && fillEmailToken({ emailString: email.html, token }),
        text: email.text && fillEmailToken({ emailString: email.text, token }),
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
