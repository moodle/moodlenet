import { MoodleNet } from '../../..'
import { getEmailPersistence, getSender } from '../email.env'

Promise.all([getEmailPersistence(), getSender()]).then(([emailPersistence, sender]) => {
  MoodleNet.respondApi({
    api: 'Email.Send_One.Req',
    async handler({ flow, req }) {
      const response = await sender.sendEmail(req.emailObj)
      await emailPersistence.storeSentEmail({ email: req.emailObj, flow, response })
      MoodleNet.emitEvent({
        event: 'Email.Send_One.SentEmail',
        flow,
        payload: response,
      })
      return response
    },
  })
})
