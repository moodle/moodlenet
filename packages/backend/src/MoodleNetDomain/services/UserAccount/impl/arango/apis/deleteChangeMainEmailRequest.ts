import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { ArangoUserAccountSubDomain } from '../ArangoUserAccountDomain'
import { DBReady, UserAccountDB } from '../env'
import { deleteChangeAccountEmailRequest } from '../functions/deleteChangeAccountEmailRequest'

export type T = WrkTypes<ArangoUserAccountSubDomain, 'UserAccount.ChangeMainEmail.DeleteRequest'>

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
