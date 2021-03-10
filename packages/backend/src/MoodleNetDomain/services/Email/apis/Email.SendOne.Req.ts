import { emit } from '../../../../lib/domain/amqp/emit'
import { WorkerInitImpl } from '../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { getSender } from '../Email.env'

export const SendOneNow: WorkerInitImpl<MoodleNetDomain, 'Email.SendOne.SendNow'> = () => {
  return [
    async ({ emailObj, flow }) => {
      const { sendEmail } = await getSender()

      const result = await sendEmail(emailObj)
      emit<MoodleNetDomain>()('Email.SendOne.EmailSent', { result, emailObj }, flow)
      return result
    },
  ]
}
