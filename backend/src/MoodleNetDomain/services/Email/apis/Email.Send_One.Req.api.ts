import { MoodleNet } from '../../..'
import { getEmailPersistence, getSender } from '../Email.env'

Promise.all([getEmailPersistence(), getSender()]).then(
  ([emailPersistence, sender]) => {
    MoodleNet.respondApi({
      api: 'Email.Send_One.Send_Now',
      async handler({ flow, req }) {
        const response = await sender.sendEmail(req.emailObj)
        await emailPersistence.storeSentEmail({
          email: req.emailObj,
          flow,
          result: response,
        })
        MoodleNet.emitEvent({
          event: 'Email.Send_One.Email_Sent',
          flow,
          payload: response,
        })
        return response
      },
    })
  }
)
