import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { deleteChangeUserEmailRequest } from '../functions/deleteChangeUserEmailRequest'
import { MoodleNetArangoUserAuthSubDomain } from '../MoodleNetArangoUserAuthSubDomain'
import { Persistence } from '../types'

export const ChangeUserEmailDeleteRequestWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAuthSubDomain, 'UserAuth.ChangeMainEmail.DeleteRequest'> => async ({ token }) => {
  return deleteChangeUserEmailRequest({
    persistence,
    token,
  })
}
