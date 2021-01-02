import { UserAccountPersistence } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const changePassword: UserAccountPersistence['changePassword'] = async ({
  newPassword,
  username,
}) => {
  const { Account } = await DBReady

  const resp = await Account.update(
    username,
    { password: newPassword },
    { returnNew: true }
  )
  return resp.new ? true : 'not found'
}
