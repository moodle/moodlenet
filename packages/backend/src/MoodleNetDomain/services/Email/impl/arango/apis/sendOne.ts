import { emit } from '../../../../../../lib/domain/amqp/emit'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { EmailSender } from '../../../sendersImpl/types'
import { MoodleNetArangoEmailDomain } from '../MoodleNetArangoEmailDomain'

type T = WrkTypes<MoodleNetDomain, 'Email.SendOne'>
export const SendOneWrkInit = ({ sender }: { sender: EmailSender }): T['Init'] => async () => {
  return [SendOneWorker({ sender })]
}
export const SendOneWorker = ({ sender }: { sender: EmailSender }): T['Worker'] => async ({ emailObj, flow }) => {
  const result = await sender.sendEmail(emailObj)
  emit<MoodleNetArangoEmailDomain>()('Email.EmailSent', { result, emailObj }, flow)
  return result
}
