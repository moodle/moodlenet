import { verifyPassword } from '../../../helpers'
import { Persistence } from '../types'
import { getActiveUserByUsername } from './getActiveUserByUsername'

export const getVerifiedUserByUsernameAndPassword = async ({
  persistence,
  password,
  username,
}: {
  persistence: Persistence
  username: string
  password: string
}) => {
  const user = await getActiveUserByUsername({
    persistence,
    username,
  })

  if (!user) {
    return null
  }
  const pwdVerified = await verifyPassword({
    hash: user.password,
    pwd: password,
  })

  return pwdVerified ? user : null
}
