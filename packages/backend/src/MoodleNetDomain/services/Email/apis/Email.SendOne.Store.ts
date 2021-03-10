import { Acks } from '../../../../lib/domain/misc'
import { SubscriberInitImpl } from '../../../../lib/domain/sub'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { getEmailPersistence } from '../Email.env'

export const StoreSentEmail: SubscriberInitImpl<MoodleNetDomain, 'Email.SendOne.EmailSent'> = () => {
  return [
    async ({ p: { emailObj, result }, flow }) => {
      const { storeSentEmail } = await getEmailPersistence()

      await storeSentEmail({
        email: emailObj,
        flow,
        result,
      })
      return Acks.Done
    },
  ]
}
