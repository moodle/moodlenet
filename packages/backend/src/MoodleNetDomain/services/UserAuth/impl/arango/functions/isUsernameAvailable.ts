import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import { Persistence, UserRecord } from '../types'

export const isUsernameAvailable = async ({
  username,
  persistence: { db, User },
}: {
  username: string
  persistence: Persistence
}) => {
  const cursor = await db.query(aql`
    FOR user IN ${User}
    FILTER user.username == ${username}
    LIMIT 1
    RETURN user
  `)
  const mUser: Maybe<UserRecord> = await cursor.next()
  return !mUser
}
