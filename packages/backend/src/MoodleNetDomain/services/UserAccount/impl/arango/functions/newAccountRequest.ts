import { aql } from 'arangojs'
import { Flow } from '../../../../../../lib/domain/flow'
import { UserAccountDB } from '../env'
import { Messages, UserAccountRecord, UserAccountStatus } from '../types'
import { isEmailAvailable } from './isEmailAvailable'
export const newAccountRequest = async ({
  db: uadb,
  email,
  token,
  flow,
}: {
  db: UserAccountDB
  email: string
  token: string
  flow: Flow
}) => {
  const emailAvailable = await isEmailAvailable({ email, db: uadb })
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

  const insertCursor = await uadb.db.query(aql`
    INSERT MERGE(
      ${document},
      { 
        createdAt: DATE_NOW(),
        updatedAt: DATE_NOW()
      } 
    )
    INTO ${uadb.UserAccount}
    RETURN NEW
  `)

  await insertCursor.next()
  insertCursor.kill()
  return null
}
