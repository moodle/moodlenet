import { verifyPassword } from '../../../helpers'
import { UserAccountDB } from '../env'
import { getActiveAccountByUsername } from './getActiveAccountByUsername'

export const getVerifiedAccountByUsernameAndPassword = async ({
  persistence,
  password,
  username,
}: {
  persistence: UserAccountDB
  username: string
  password: string
}) => {
  const account = await getActiveAccountByUsername({
    persistence,
    username,
  })

  if (!account) {
    return null
  }
  const pwdVerified = await verifyPassword({
    hash: account.password,
    pwd: password,
  })

  return pwdVerified ? account : null
}
