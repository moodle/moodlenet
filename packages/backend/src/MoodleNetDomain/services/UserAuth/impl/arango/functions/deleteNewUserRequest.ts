import { aql } from 'arangojs'
import { Persistence, UserStatus } from '../types'
export const deleteNewUserRequest = async ({
  token,
  persistence: { db, User: User },
}: {
  persistence: Persistence
  token: string
}) => {
  const cursor = await db.query(aql`
    FOR user IN ${User}
      FILTER user.firstActivationToken == ${token}
          && user.status == ${UserStatus.WaitingFirstActivation}
      LIMIT 1
      REMOVE user IN ${User}
      RETURN null
  `)
  await cursor.next()
}
