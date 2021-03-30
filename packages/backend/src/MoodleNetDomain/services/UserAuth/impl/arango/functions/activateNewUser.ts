import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { aql } from 'arangojs'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Role } from '../../../../../types'
import { ActiveUser, Messages, Persistence, UserStatus } from '../types'
import { isUsernameAvailable } from './isUsernameAvailable'

export const activateNewUser = async ({
  persistence,
  token,
  password,
  username,
  profileId,
}: {
  persistence: Persistence
  token: string
  username: string
  password: string
  profileId: Id
}) => {
  const { db, User } = persistence
  const usernameAvailable = await isUsernameAvailable({ username, persistence })

  if (!usernameAvailable) {
    return Messages.UsernameNotAvailable
  }
  const userRole: Role = 'User'
  const cursor = await db.query(aql`
    FOR user IN ${User}
    FILTER user.firstActivationToken == ${token}
    LIMIT 1
    UPDATE user WITH {
      updatedAt: DATE_NOW(),
      password: ${password},
      username: ${username},
      status: ${UserStatus.Active},
      changeEmailRequest: null,
      role: ${userRole},
      profileId: ${profileId}
    } IN ${User}
    RETURN NEW
  `)

  const mNewUser: Maybe<ActiveUser> = await cursor.next()

  if (!mNewUser) {
    return Messages.NotFound
  }

  return mNewUser
}
