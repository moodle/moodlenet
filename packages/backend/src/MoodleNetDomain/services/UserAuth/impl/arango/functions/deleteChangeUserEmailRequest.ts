import { aql } from 'arangojs'
import { Persistence } from '../types'
export const deleteChangeUserEmailRequest = async ({
  token,
  persistence: { User, db },
}: {
  persistence: Persistence
  token: string
}) => {
  const cursor = await db.query(aql`
    FOR user IN ${User}
      FILTER user.changeEmailRequest.token == ${token}
      LIMIT 1
        UPDATE user WITH {
          changeEmailRequest: null
        } IN ${User}
      RETURN null
  `)
  await cursor.next()

  return null
}
