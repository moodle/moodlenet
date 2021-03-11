import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { deleteNewAccountRequest } from '../functions/deleteNewAccountRequest'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export type NewAccountRequestDeletePersistence = (_: { token: string }) => Promise<unknown>

export type T = WrkTypes<MoodleNetArangoUserAccountSubDomain, 'UserAccount.RegisterNewAccount.DeleteRequest'>

export const RegisterNewAccountDeleteRequestApiWorker = ({ persistence }: { persistence: Persistence }) => {
  const worker: T['Worker'] = ({ token }) => deleteNewAccountRequest({ persistence, token })
  return worker
}
