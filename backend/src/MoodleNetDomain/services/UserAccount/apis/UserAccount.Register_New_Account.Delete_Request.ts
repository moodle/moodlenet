import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { getAccountPersistence } from '../UserAccount.env'

export type NewAccountRequestDeletePersistence = (_: {
  token: string
}) => Promise<unknown>

export type Register_New_Account_Delete_Request_Api = Api<{ token: string }, {}>

export const Register_New_Account_Delete_Request_Api_Handler = async () => {
  const { deleteNewAccountRequest } = await getAccountPersistence()

  const handler: RespondApiHandler<Register_New_Account_Delete_Request_Api> = async ({
    req: { token },
  }) => {
    await deleteNewAccountRequest({
      token,
    })
    return {}
  }

  return handler
}
