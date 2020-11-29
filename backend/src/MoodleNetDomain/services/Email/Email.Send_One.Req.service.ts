import { MoodleNet } from '../..'
import { getEmailPersistence, getSender } from './email.env'

MoodleNet.respondApi({
  api: 'Email.Send_One.Req',
  async handler({ flow, req }) {
    const response = await (await getSender()).sendEmail(req.emailObj)
    await (await getEmailPersistence()).storeSentEmail({ email: req.emailObj, flow, response })
    MoodleNet.emitEvent({
      event: 'Email.Send_One.SentEmail',
      flow,
      payload: response,
    })
    return response
  },
})
