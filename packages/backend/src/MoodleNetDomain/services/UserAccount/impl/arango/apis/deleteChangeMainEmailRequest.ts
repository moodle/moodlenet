import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { deleteChangeAccountEmailRequest } from '../functions/deleteChangeAccountEmailRequest'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export type T = WrkTypes<MoodleNetArangoUserAccountSubDomain, 'UserAccount.ChangeMainEmail.DeleteRequest'>

export const ChangeAccountEmailDeleteRequestWorker = ({ persistence }: { persistence: Persistence }) => {
  const worker: T['Worker'] = async ({ token }) => {
    return deleteChangeAccountEmailRequest({
      persistence,
      token,
    })
  }
  return worker
}
