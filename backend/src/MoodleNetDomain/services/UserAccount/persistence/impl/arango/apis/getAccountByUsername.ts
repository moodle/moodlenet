import { UserAccountPersistence } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const getAccountByUsername: UserAccountPersistence['getAccountByUsername'] = async ({
  username,
}) => {
  const { Account } = await DBReady
  const mAccount = await Account.document(username)
  return mAccount
}
