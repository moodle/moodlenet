import { emit } from '../../../../../../lib/domain/amqp/emit'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { EmailSender } from '../../../sendersImpl/types'
import { MoodleNetArangoEmailDomain } from '../MoodleNetArangoEmailDomain'

export const SendOneWorker = ({
  sender,
}: {
  sender: EmailSender
}): LookupWorker<MoodleNetDomain, 'Email.SendOne'> => async ({ emailObj, flow }) => {
  const result = await sender.sendEmail(emailObj)
  emit<MoodleNetArangoEmailDomain>()('Email.EmailSent', { result, emailObj }, flow)
  return result
}
