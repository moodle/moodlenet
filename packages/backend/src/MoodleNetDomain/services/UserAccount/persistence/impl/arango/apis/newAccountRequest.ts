import { aql } from 'arangojs'
import { Messages, UserAccountPersistence, UserAccountRecord, UserAccountStatus } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
import { isEmailAvailable } from './isEmailAvailable'
export const newAccountRequest: UserAccountPersistence['newAccountRequest'] = async ({ email, token, flow }) => {
  const { db, UserAccount } = await DBReady
  const emailAvailable = await isEmailAvailable({ email })
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

  const insertCursor = await db.query(aql`
    INSERT MERGE(
      ${document},
      { 
        createdAt: DATE_NOW(),
        updatedAt: DATE_NOW()
      } 
    )
    INTO ${UserAccount}
    RETURN NEW
  `)

  await insertCursor.next()
  return null
}
