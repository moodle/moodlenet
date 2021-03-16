import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import { ActiveUser, Persistence, UserStatus } from '../types'

export const getActiveUserByUsername = async ({
  username,
  persistence: { User, db },
}: {
  username: string
  persistence: Persistence
}) => {
  const cursor = await db.query(aql`
    FOR user IN ${User}
    FILTER user.username == ${username}
          && user.status == ${UserStatus.Active}
    LIMIT 1
    RETURN user
  `)
  const mUser: Maybe<ActiveUser> = await cursor.next()
  return mUser
}
