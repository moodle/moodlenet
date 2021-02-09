import { aql } from 'arangojs'
import { ChangeEmailRequest, Messages, UserAccountPersistence } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
import { isEmailAvailable } from './isEmailAvailable'

export const changeAccountEmailRequest: UserAccountPersistence['changeAccountEmailRequest'] = async ({
  flow,
  accountId,
  newEmail,
  token,
}) => {
  const { db } = await DBReady
  const emailAvailable = await isEmailAvailable({ email: newEmail })
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
    FOR account IN UserAccount
      FILTER account._id == ${accountId}
      LIMIT 1
      UPDATE account WITH { 
        changeEmailRequest: MERGE({
          createdAt: DATE_NOW(),
        }, ${changeEmailRequest})
      } IN UserAccount
    RETURN NEW
  `)

  const userAccount = await cursor.next()
  if (!userAccount) {
    return Messages.NotFound
  }
  return userAccount
}
