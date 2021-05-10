import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { deleteNewUserRequest } from '../functions/deleteNewUserRequest'
import { MoodleNetArangoUserAuthSubDomain } from '../MoodleNetArangoUserAuthSubDomain'
import { Persistence } from '../types'

export type NewUserRequestDeletePersistence = (_: { token: string }) => Promise<unknown>

export const RegisterNewUserDeleteRequestApiWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAuthSubDomain, 'UserAuth.RegisterNewUser.DeleteRequest'> => ({ token }) =>
  deleteNewUserRequest({ persistence, token })
