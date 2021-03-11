import { Acks } from '../../../../../../lib/domain/misc'
import { SubTypes } from '../../../../../../lib/domain/sub'
import { ArangoEmailDB, DBReady } from '../env'
import { storeSentEmail } from '../functions/storeSentEmail'
import { MoodleNetArangoEmailDomain } from '../MoodleNetArangoEmailDomain'

type T = SubTypes<MoodleNetArangoEmailDomain, 'Email.EmailSent'>

export const StoreSentEmailSubInit: T['Init'] = async () => {
  const db = await DBReady
  return [StoreSentEmailSubscriber({ db })]
}

export const StoreSentEmailSubscriber = ({ db }: { db: ArangoEmailDB }) => {
  const subscriber: T['Subscriber'] = async ({ p: { emailObj, result }, flow }) => {
    await storeSentEmail({
      email: emailObj,
      flow,
      result,
      db,
    })
    return Acks.Done
  }
  return subscriber
}
