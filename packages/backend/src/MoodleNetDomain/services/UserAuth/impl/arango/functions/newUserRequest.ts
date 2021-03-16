import { aql } from 'arangojs'
import { Flow } from '../../../../../../lib/domain/flow'
import { Messages, Persistence, UserRecord, UserStatus } from '../types'
import { isEmailAvailable } from './isEmailAvailable'
export const newUserRequest = async ({
  persistence,
  email,
  token,
  flow,
}: {
  persistence: Persistence
  email: string
  token: string
  flow: Flow
}) => {
  const emailAvailable = await isEmailAvailable({ email, persistence })
  if (!emailAvailable) {
    return Messages.EmailNotAvailable
  }

  const document: UserRecord = {
    _id: undefined as never,
    createdAt: undefined as never,
    updatedAt: undefined as never,
    status: UserStatus.WaitingFirstActivation,
    email,
    _flow: flow,
    firstActivationToken: token,
  }

  const insertCursor = await persistence.db.query(aql`
    INSERT MERGE(
      ${document},
      { 
        createdAt: DATE_NOW(),
        updatedAt: DATE_NOW()
      } 
    )
    INTO ${persistence.User}
    RETURN NEW
  `)

  await insertCursor.next()
  insertCursor.kill()
  return null
}
