import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { aql } from 'arangojs'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Role } from '../../../../../types'
import { ActivationMessage, ActiveUserAccount, Messages, Persistence, UserAccountStatus } from '../types'
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
  const usernameAvailable = await isUsernameAvailable({ username, persistence })

  if (!usernameAvailable) {
    return Messages.UsernameNotAvailable as ActivationMessage
  }

  const cursor = await persistence.db.query(aql`
    FOR userAccount IN UserAccount
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
    } IN UserAccount
    RETURN NEW
  `)

  const newAccountDoc: Maybe<ActiveUserAccount> = await cursor.next()

  if (!newAccountDoc) {
    return Messages.NotFound as ActivationMessage
  }

  return newAccountDoc as ActiveUserAccount
}
