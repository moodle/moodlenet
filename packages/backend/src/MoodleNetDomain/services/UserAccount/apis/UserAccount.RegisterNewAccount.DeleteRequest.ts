import { getAccountPersistence } from '../UserAccount.env'

export type NewAccountRequestDeletePersistence = (_: { token: string }) => Promise<unknown>

export const RegisterNewAccountDeleteRequestApiHandler = async ({ token }: { token: string }): Promise<unknown> => {
  const { deleteNewAccountRequest } = await getAccountPersistence()
  return deleteNewAccountRequest({
    token,
  })
}
