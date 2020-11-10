import { MNQJobMeta, AnyProgressOf } from '../../../lib/queue/types'
import { SendEmailJobReq, SendEmailProgress } from './job'

export type RecordId = string
export interface EmailPersistenceImpl {
  storeSentEmail(_: StoreSentEmailData): Promise<RecordId>
}
export type StoreSentEmailData = {
  req: SendEmailJobReq
  res: AnyProgressOf<SendEmailProgress>
  job: MNQJobMeta
}
