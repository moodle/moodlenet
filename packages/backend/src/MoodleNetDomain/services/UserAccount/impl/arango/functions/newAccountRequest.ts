import { aql } from 'arangojs'
import { Flow } from '../../../../../../lib/domain/flow'
import { Messages, Persistence, UserAccountRecord, UserAccountStatus } from '../types'
import { isEmailAvailable } from './isEmailAvailable'
export const newAccountRequest = async ({
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
  const emailAvailable = await isEmailAvailable({ email, db: persistence })
  if (!emailAvailable) {
    return Messages.EmailNotAvailable
  }
  const document: UserAccountRecord = {
    _id: undefined as never,
    createdAt: undefined as never,
    updatedAt: undefined as never,
    status: UserAccountStatus.WaitingFirstActivation,
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
    INTO ${persistence.UserAccount}
    RETURN NEW
  `)

  await insertCursor.next()
  insertCursor.kill()
  return null
}
