import { aql } from 'arangojs'
import { Flow } from '../../../../../../lib/domain/flow'
import { UserAccountDB } from '../env'
import { ChangeEmailRequest, Messages } from '../types'
import { isEmailAvailable } from './isEmailAvailable'

export const changeAccountEmailRequest = async ({
  db: uadb,
  flow,
  accountId,
  newEmail,
  token,
}: {
  db: UserAccountDB
  flow: Flow
  token: string
  accountId: string
  newEmail: string
}) => {
  const { UserAccount, db } = uadb
  const emailAvailable = await isEmailAvailable({ email: newEmail, db: uadb })
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
    FOR account IN ${UserAccount}
      FILTER account._id == ${accountId}
      LIMIT 1
      UPDATE account WITH { 
        changeEmailRequest: MERGE({
          createdAt: DATE_NOW(),
        }, ${changeEmailRequest})
      } IN ${UserAccount}
    RETURN NEW
  `)

  const userAccount = await cursor.next()
  if (!userAccount) {
    return Messages.NotFound
  }
  return userAccount
}
