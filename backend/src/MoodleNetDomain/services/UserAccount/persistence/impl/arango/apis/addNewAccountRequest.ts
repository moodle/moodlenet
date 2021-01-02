import { aql } from 'arangojs'
import {
  NewAccountRequestDocument,
  UserAccountPersistence,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
import { isAccountOrOpenRequestWithEmailPresent } from './isAccountOrOpenRequestWithEmailPresent'
export const addNewAccountRequest: UserAccountPersistence['addNewAccountRequest'] = async ({
  req: { email },
  flow,
}) => {
  const { db } = await DBReady
  if (await isAccountOrOpenRequestWithEmailPresent({ email })) {
    return 'account or request with this email already present'
  }

  const document: Omit<NewAccountRequestDocument, 'createdAt' | 'updatedAt'> = {
    ...flow,
    email,
    status: 'Waiting Email Confirmation',
  }

  const insertCursor = await db.query(aql`
    INSERT MERGE(
      ${document},
      { 
        createdAt: DATE_NOW(),
        updatedAt: DATE_NOW()
      } 
    )
    INTO NewAccountRequest
    RETURN null
  `)

  await insertCursor.next()
  return true
}
