import { Acks } from '../../../../../../lib/domain/misc'
import { Subscriber } from '../../../../../../lib/domain/sub'
import { storeSentEmail } from '../functions/storeSentEmail'
import { MoodleNetArangoEmailDomain } from '../MoodleNetArangoEmailDomain'
import { Persistence } from '../types'

export const StoreSentEmailSubscriber = ({
  persistence,
}: {
  persistence: Persistence
}): Subscriber<MoodleNetArangoEmailDomain, 'Email.EmailSent'> => async ({ p: { emailObj, result }, flow }) => {
  await storeSentEmail({
    email: emailObj,
    flow,
    result,
    db: persistence,
  })
  return Acks.Done
}
