import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { deleteNewAccountRequest } from '../functions/deleteNewAccountRequest'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export type NewAccountRequestDeletePersistence = (_: { token: string }) => Promise<unknown>

export const RegisterNewAccountDeleteRequestApiWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAccountSubDomain, 'UserAccount.RegisterNewAccount.DeleteRequest'> => ({ token }) =>
  deleteNewAccountRequest({ persistence, token })
