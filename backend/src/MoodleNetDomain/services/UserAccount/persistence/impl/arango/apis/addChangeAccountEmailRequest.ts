import { aql } from 'arangojs'
import {
  ChangeAccountEmailRequestDocument,
  UserAccountPersistence,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
import { isAccountOrOpenRequestWithEmailPresent } from './isAccountOrOpenRequestWithEmailPresent'

export const addChangeAccountEmailRequest: UserAccountPersistence['addChangeAccountEmailRequest'] = async ({
  flow,
  req: { newEmail, username },
}) => {
  const { db } = await DBReady
  if (await isAccountOrOpenRequestWithEmailPresent({ email: newEmail })) {
    return 'account or request with this email already present'
  }

  const document: Omit<
    ChangeAccountEmailRequestDocument,
    'createdAt' | 'updatedAt'
  > = {
    ...flow,
    newEmail,
    username,
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
    INTO ChangeAccountEmailRequest
    RETURN null
  `)

  await insertCursor.next()
  return true
}
