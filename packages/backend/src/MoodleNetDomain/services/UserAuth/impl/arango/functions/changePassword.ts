import { aql } from 'arangojs'
import { Messages, Persistence } from '../types'

export const changeUserPassword = async ({
  persistence: { User, db },
  userId,
  currentPassword,
  newPassword,
}: {
  persistence: Persistence
  currentPassword: string
  newPassword: string
  userId: string
}) => {
  const cursor = await db.query(aql`
    FOR user IN ${User}
    FILTER user.id == ${userId} 
        && user.password == ${currentPassword}
    LIMIT 1
    UPDATE user WITH { 
      password: ${newPassword}
    } IN ${User}
    RETURN NEW
  `)
  const doc = await cursor.next()
  if (!doc) {
    return Messages.NotFound
  }
  return null
}
