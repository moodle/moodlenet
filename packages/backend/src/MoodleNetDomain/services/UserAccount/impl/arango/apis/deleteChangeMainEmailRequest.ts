import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { deleteChangeAccountEmailRequest } from '../functions/deleteChangeAccountEmailRequest'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export const ChangeAccountEmailDeleteRequestWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAccountSubDomain, 'UserAccount.ChangeMainEmail.DeleteRequest'> => async ({
  token,
}) => {
  return deleteChangeAccountEmailRequest({
    persistence,
    token,
  })
}
