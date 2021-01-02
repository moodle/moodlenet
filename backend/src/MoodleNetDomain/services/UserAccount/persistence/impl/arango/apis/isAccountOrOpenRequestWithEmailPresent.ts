import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import {
  AccountDocument,
  NewAccountRequestDocument,
  NewAccountRequestDocumentStatus,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

// TODO: should it check on change email requests too ?
export const isAccountOrOpenRequestWithEmailPresent = async ({
  email,
}: {
  email: string
}) => {
  const { db } = await DBReady
  const accountCursor = await db.query(aql`
    FOR acc in Account
    FILTER acc.email==${email}
    LIMIT 1
    RETURN acc
  `)

  const maybeAccountWithThisEmail: Maybe<AccountDocument> = await accountCursor.next()
  if (maybeAccountWithThisEmail) {
    return true
  }

  const searchRequestStatuses: NewAccountRequestDocumentStatus[] = [
    'Waiting Email Confirmation',
    'Email Confirmed',
  ]

  const accountRequestCursor = await db.query(aql`
        FOR req in NewAccountRequest
        FILTER req.email==${email} && req.status IN ${searchRequestStatuses}
        LIMIT 1
        RETURN req
      `)

  const maybeRequestWithThisEmail: Maybe<NewAccountRequestDocument> = await accountRequestCursor.next()
  if (maybeRequestWithThisEmail) {
    return true
  }
  return false
}
