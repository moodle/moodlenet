import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import { Messages, Persistence, UserRecord } from '../types'

export const confirmUserEmailChangeRequest = async ({
  token,
  persistence: { User, db },
}: {
  token: string
  persistence: Persistence
}) => {
  const cursor = await db.query(aql`
    FOR user IN ${User}
      FILTER user.changeEmailRequest.token == ${token}
      LIMIT 1
        UPDATE user WITH {
          email: user.changeEmailRequest.email,
          changeEmailRequest: null
        } IN ${User}
      RETURN user
  `)
  const mUser: Maybe<UserRecord> = await cursor.next()

  if (!mUser) {
    return Messages.NotFound
  }

  return null
}
