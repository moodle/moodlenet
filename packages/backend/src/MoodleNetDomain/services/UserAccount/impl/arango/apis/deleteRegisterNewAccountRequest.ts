import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { DBReady, UserAccountDB } from '../env'
import { deleteNewAccountRequest } from '../functions/deleteNewAccountRequest'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'

export type NewAccountRequestDeletePersistence = (_: { token: string }) => Promise<unknown>

export type T = WrkTypes<MoodleNetArangoUserAccountSubDomain, 'UserAccount.RegisterNewAccount.DeleteRequest'>

export const RegisterNewAccountDeleteRequestApiWrkInit: T['Init'] = async () => {
  const db = await DBReady
  return [RegisterNewAccountDeleteRequestApiWorker({ db })]
}

export const RegisterNewAccountDeleteRequestApiWorker = ({ db }: { db: UserAccountDB }) => {
  const worker: T['Worker'] = ({ token }) => deleteNewAccountRequest({ db, token })
  return worker
}
