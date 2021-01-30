import { getAccountPersistence } from '../UserAccount.env'

export type ChangeAccountEmailRequestDeletePersistence = (_: {
  token: string
}) => Promise<unknown>

export const ChangeAccountEmailDeleteRequestApiHandler = async ({
  token,
}: {
  token: string
}): Promise<unknown> => {
  const { deleteChangeAccountEmailRequest } = await getAccountPersistence()
  return deleteChangeAccountEmailRequest({
    token,
  })
}
