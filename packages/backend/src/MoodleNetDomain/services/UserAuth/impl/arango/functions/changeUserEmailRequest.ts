import { aql } from 'arangojs'
import { Flow } from '../../../../../../lib/domain/flow'
import { ChangeEmailRequest, Messages, Persistence } from '../types'
import { isEmailAvailable } from './isEmailAvailable'

export const changeUserEmailRequest = async ({
  persistence,
  flow,
  userId,
  newEmail,
  token,
}: {
  persistence: Persistence
  flow: Flow
  token: string
  userId: string
  newEmail: string
}) => {
  const { User, db } = persistence
  const emailAvailable = await isEmailAvailable({ email: newEmail, persistence })
  if (!emailAvailable) {
    return Messages.EmailNotAvailable
  }

  const changeEmailRequest: ChangeEmailRequest = {
    createdAt: undefined as never,
    _flow: flow,
    token: token,
    email: newEmail,
  }

  const cursor = await db.query(aql`
    FOR user IN ${User}
      FILTER user._id == ${userId}
      LIMIT 1
      UPDATE user WITH { 
        changeEmailRequest: MERGE({
          createdAt: DATE_NOW(),
        }, ${changeEmailRequest})
      } IN ${User}
    RETURN NEW
  `)

  const user = await cursor.next()
  if (!user) {
    return Messages.NotFound
  }
  return user
}
