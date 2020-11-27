import { aql } from 'arangojs'
import {
  createDatabaseIfNotExists,
  createDocumentCollectionIfNotExists,
} from '../../../../../../lib/helpers/arango'
import { Maybe } from '../../../../../../lib/helpers/types'
import {
  AccountingPersistence,
  AccountDocument,
  NewAccountRequestDocument,
  NewAccountRequestDocumentStatus,
} from '../../types'
import { env } from './account.persistence.arango.env'

export const db = createDatabaseIfNotExists({
  dbConfig: { url: env.url },
  name: env.databaseName,
  dbCreateOpts: {},
})

export const Account = createDocumentCollectionIfNotExists<AccountDocument>({
  name: 'Account',
  db,
  createOpts: {},
})

export const NewAccountRequest = createDocumentCollectionIfNotExists<NewAccountRequestDocument>({
  name: 'NewAccountRequest',
  db,
  createOpts: {},
})

const addNewAccountRequest: AccountingPersistence['addNewAccountRequest'] = async ({
  req: { email },
  flow,
}) => {
  const document: Omit<NewAccountRequestDocument, 'createdAt' | 'updatedAt'> = {
    ...flow,
    email,
    status: 'Waiting Email Confirmation',
  }

  await (
    await (await db).query(aql`
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
  ).next()
  return
}
const activateNewAccount: AccountingPersistence['activateNewAccount'] = async ({
  requestFlow,
  username,
}) => {
  const request = await (await NewAccountRequest).document(requestFlow._key)
  if (!request) {
    return 'Request Not Found'
  }
  const usernameAvailable = await isUserNameAvailable({ username })
  if (!usernameAvailable) {
    return 'Username Not Available'
  }
  const accountDoc: Omit<AccountDocument, 'createdAt' | 'updatedAt'> = {
    active: true,
    email: request.email,
    requestFlow,
    username,
  }
  const newAccountDoc: AccountDocument = await (
    await (await db).query(aql`
      INSERT MERGE(
        ${accountDoc},
        {
          createdAt: DATE_NOW()
          updatedAt: DATE_NOW()
        }
      )
      IN Account
      RETURN NEW
    `)
  ).next()
  return newAccountDoc
}
const confirmNewAccountRequest: AccountingPersistence['confirmNewAccountRequest'] = async ({
  flow,
}) => {
  const confirmedStatus: NewAccountRequestDocumentStatus = 'Email Confirmed'
  const confirmRes: Maybe<NewAccountRequestDocument | true> = await (
    await (await db).query(aql`
      LET doc = DOCUMENT(CONCAT("NewAccountRequest/",${flow._key}))
      UPDATE doc
      LET wasConfirmed = doc.status == "${confirmedStatus}"
      WITH wasConfirmed
        ? {
          status:"${confirmedStatus}",
          updatedAt: DATE_NOW()
        }
        : {}
      IN NewAccountRequest
      RETURN wasConfirmed ? true : NEW
    `)
  ).next()
  if (!confirmRes) {
    return 'Request Not Found'
  } else if (confirmRes === true) {
    return 'Already Confirmed'
  }
  return 'Confirmed'
}
const isUserNameAvailable: AccountingPersistence['isUserNameAvailable'] = async ({ username }) => {
  const available = await (
    await (await db).query(aql`
    FOR doc IN Account
    FILTER doc.username==${username}
    LIMIT 1
    RETURN doc ? false : true
  `)
  ).next()
  return available
}
const unconfirmedNewAccountRequest: AccountingPersistence['unconfirmedNewAccountRequest'] = async ({
  flow,
}) => {
  const unconfirmedStatus: NewAccountRequestDocumentStatus = 'Confirm Expired'
  const requestDoc = await (
    await (await db).query(aql`
      LET doc = DOCUMENT(CONCAT("NewAccountRequest/",${flow._key}))
      UPDATE doc
      WITH {
        status:${unconfirmedStatus},
        updatedAt: DATE_NOW()
      }
      IN NewAccountRequest
      RETURN NEW
    `)
  ).next()
  return requestDoc
}
export const arangoAccountingPersistenceImpl: AccountingPersistence = {
  addNewAccountRequest,
  confirmNewAccountRequest,
  unconfirmedNewAccountRequest,
  isUserNameAvailable,
  activateNewAccount,
}
