import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { getAccountPersistence } from '../UserAccount.env'

export type NewAccountRequestDeletePersistence = (_: {
  token: string
}) => Promise<unknown>

export type RegisterNewAccountDeleteRequestApi = Api<{ token: string }, {}>

export const RegisterNewAccountDeleteRequestApiHandler = async () => {
  const { deleteNewAccountRequest } = await getAccountPersistence()

  const handler: RespondApiHandler<RegisterNewAccountDeleteRequestApi> = async ({
    req: { token },
  }) => {
    await deleteNewAccountRequest({
      token,
    })
    return {}
  }

  return handler
}
