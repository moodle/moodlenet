import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import { Persistence, UserRecord } from '../types'

export const isEmailAvailable = async ({
  email,
  persistence: { db, User },
}: {
  persistence: Persistence
  email: string
}) => {
  const cursor = await db.query(aql`
    FOR user IN ${User}
    FILTER user.email == ${email}
            || user.changeEmailRequest.email == ${email}
    LIMIT 1
    RETURN user
  `)
  const mUser: Maybe<UserRecord> = await cursor.next()
  return !mUser
}
