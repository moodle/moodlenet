import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { getAccountPersistence } from '../UserAccount.env'

export type ChangeAccountEmailRequestDeletePersistence = (_: {
  token: string
}) => Promise<unknown>

export type ChangeAccountEmailDeleteRequestApi = Api<{ token: string }, {}>

export const ChangeAccountEmailDeleteRequestApiHandler = async () => {
  const { deleteChangeAccountEmailRequest } = await getAccountPersistence()

  const handler: RespondApiHandler<ChangeAccountEmailDeleteRequestApi> = async ({
    req: { token },
  }) => {
    await deleteChangeAccountEmailRequest({
      token,
    })
    return {}
  }

  return handler
}
