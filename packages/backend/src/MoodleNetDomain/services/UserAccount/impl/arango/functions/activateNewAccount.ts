import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { aql } from 'arangojs'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Role } from '../../../../../types'
import { ActiveUserAccount, Messages, Persistence, UserAccountStatus } from '../types'
import { isUsernameAvailable } from './isUsernameAvailable'

export const activateNewAccount = async ({
  persistence,
  token,
  password,
  username,
  userId,
}: {
  persistence: Persistence
  token: string
  username: string
  password: string
  userId: Id
}) => {
  const { db, UserAccount } = persistence
  const usernameAvailable = await isUsernameAvailable({ username, persistence })

  if (!usernameAvailable) {
    return Messages.UsernameNotAvailable
  }

  const cursor = await db.query(aql`
    FOR userAccount IN ${UserAccount}
    FILTER userAccount.firstActivationToken == ${token}
    LIMIT 1
    UPDATE userAccount WITH {
      updatedAt: DATE_NOW(),
      password: ${password},
      username: ${username},
      status: ${UserAccountStatus.Active},
      changeEmailRequest: null,
      role: ${Role.User},
      userId: ${userId}
    } IN ${UserAccount}
    RETURN NEW
  `)

  const mNewActiveUserAccount: Maybe<ActiveUserAccount> = await cursor.next()

  if (!mNewActiveUserAccount) {
    return Messages.NotFound
  }

  return mNewActiveUserAccount
}
