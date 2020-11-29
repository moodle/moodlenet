import { MoodleNet } from '../..'
import { ApiReturn } from '../../../lib/domain/api/types'
import { newUuid } from '../../../lib/helpers/misc'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { getEmailPersistence } from './email.env'
import { EmailObj } from './types'

MoodleNet.respondApi({
  api: 'Email.Verify_Email.Req',
  async handler({ req, flow }): ApiReturn<MoodleNetDomain, 'Email.Verify_Email.Req'> {
    const { email, tokenReplaceRegEx } = req
    const token = `${newUuid()}|${flow._key}`
    const regex = new RegExp(tokenReplaceRegEx, 'g')
    const emailObj: EmailObj = {
      ...email,
      html: email.html?.replace(regex, token),
      text: email.text?.replace(regex, token),
    }
    const documentKey = await (await getEmailPersistence()).storeVerifyingEmail({
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
