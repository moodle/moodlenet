import { aql } from 'arangojs'
import { AccountDocument, UserAccountPersistence } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
import { isUserNameAvailable } from './isUserNameAvailable'
export const activateNewAccount: UserAccountPersistence['activateNewAccount'] = async ({
  requestFlowKey,
  password,
  username,
}) => {
  const { NewAccountRequest, db } = await DBReady
  const request = await NewAccountRequest.document(requestFlowKey)

  if (!request) {
    return 'Request Not Found'
  }

  if (request.status === 'Confirm Expired') {
    return 'Request Not Found'
  }

  if (request.status === 'Waiting Email Confirmation') {
    return 'Unconfirmed Request'
  }

  if (request.status === 'Account Created') {
    return 'Account Already Created'
  }

  const usernameAvailable = await isUserNameAvailable({ username })
  if (!usernameAvailable) {
    return 'Username Not Available'
  }

  const accountDoc: Omit<AccountDocument, 'createdAt' | 'updatedAt'> = {
    active: true,
    email: request.email,
    requestFlowKey,
    password,
    username,
  }
  const cursor = await db.query(aql`
    INSERT MERGE(
        ${accountDoc},
        {
          _key: ${username},
          createdAt: DATE_NOW(),
          updatedAt: DATE_NOW()
        }
      )
      IN Account
      RETURN NEW
  `)

  const newAccountDoc: AccountDocument = await cursor.next()

  if (newAccountDoc) {
    await NewAccountRequest.update(requestFlowKey, {
      status: 'Account Created',
    })
  }

  return newAccountDoc
}
