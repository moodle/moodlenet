import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { getAccountPersistence } from '../UserAccount.env'

export type ChangeAccountEmailRequestDeletePersistence = (_: {
  token: string
}) => Promise<unknown>

export type Change_Account_Email_Delete_Request_Api = Api<{ token: string }, {}>

export const Change_Account_Email_Delete_Request_Api_Handler = async () => {
  const { deleteChangeAccountEmailRequest } = await getAccountPersistence()

  const handler: RespondApiHandler<Change_Account_Email_Delete_Request_Api> = async ({
    req: { token },
  }) => {
    await deleteChangeAccountEmailRequest({
      token,
    })
    return {}
  }

  return handler
}
