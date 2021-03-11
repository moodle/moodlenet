import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { DBReady, UserAccountDB } from '../env'
import { deleteChangeAccountEmailRequest } from '../functions/deleteChangeAccountEmailRequest'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'

export type T = WrkTypes<MoodleNetArangoUserAccountSubDomain, 'UserAccount.ChangeMainEmail.DeleteRequest'>

export const ChangeAccountEmailDeleteRequestApiWrkInit: T['Init'] = async () => {
  const db = await DBReady
  return [ChangeAccountEmailDeleteRequestApiWorker({ db })]
}

export const ChangeAccountEmailDeleteRequestApiWorker = ({ db }: { db: UserAccountDB }) => {
  const worker: T['Worker'] = async ({ token }) => {
    return deleteChangeAccountEmailRequest({
      db,
      token,
    })
  }
  return worker
}
