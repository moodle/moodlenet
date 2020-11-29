import { aql } from 'arangojs'
import {
  createDatabaseIfNotExists,
  createDocumentCollectionIfNotExists,
} from '../../../../../../lib/helpers/arango'
import { Maybe } from '../../../../../../lib/helpers/types'
import { DefaultConfig } from '../../../assets/defaultConfig'
import {
  AccountingPersistence,
  AccountDocument,
  NewAccountRequestDocument,
  NewAccountRequestDocumentStatus,
  Config as ConfigType,
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

export const Config = createDocumentCollectionIfNotExists<ConfigType>({
  name: 'Config',
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
  await NewAccountRequest
  await Account

  const maybeAccountWithThisEmail = await (
    await (await db).query(aql`
      FOR acc in Account
      FILTER acc.email==${email}
      LIMIT 1
      RETURN acc
    `)
  ).next()
  if (maybeAccountWithThisEmail) {
    return 'account or request with this email already present'
  }

  const maybeRequestWithThisEmail = await (
    await (await db).query(aql`
      FOR req in NewAccountRequest
      FILTER req.email==${email}
      LIMIT 1
      RETURN req
    `)
  ).next()
  if (maybeRequestWithThisEmail) {
    return 'account or request with this email already present'
  }

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
  return true
}

const activateNewAccount: AccountingPersistence['activateNewAccount'] = async ({
  requestFlowKey,
  password,
  username,
}) => {
  await Account

  const request = await (await NewAccountRequest).document(requestFlowKey)
  if (!request) {
    return 'Request Not Found'
  }
  if (request.status === 'Confirm Expired') {
    return 'Request Not Found'
  }
  if (request.status === 'Waiting Email Confirmation') {
    return 'Unconfirmed Request'
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
  const newAccountDoc: AccountDocument = await (
    await (await db).query(aql`
      INSERT MERGE(
        ${accountDoc},
        {
          createdAt: DATE_NOW(),
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
  await NewAccountRequest

  const confirmedStatus: NewAccountRequestDocumentStatus = 'Email Confirmed'
  const confirmRes: Maybe<NewAccountRequestDocument | true> = await (
    await (await db).query(aql`
      LET doc = DOCUMENT(CONCAT("NewAccountRequest/",${flow._key}))
      LET alreadyConfirmed = doc.status == ${confirmedStatus}
      UPDATE doc
      WITH (alreadyConfirmed
        ? {}
        : {
          status:${confirmedStatus},
          updatedAt: DATE_NOW()
        })
      IN NewAccountRequest
      RETURN (alreadyConfirmed ? true : NEW)
    `)
  ).next()
  if (!confirmRes) {
    return 'Request Not Found'
  }
  if (confirmRes === true) {
    return 'Previously Confirmed'
  }
  return 'Confirmed'
}

const isUserNameAvailable: AccountingPersistence['isUserNameAvailable'] = async ({ username }) => {
  await Account

  const accountWithSameUsername = await (
    await (await db).query(aql`
    FOR doc IN Account
    FILTER doc.username==${username}
    LIMIT 1
    RETURN doc 
  `)
  ).next()
  return !accountWithSameUsername
}

const config: AccountingPersistence['config'] = async () => {
  const Cfg = await Config

  const currentConfig = await (
    await (await db).query(aql`
      FOR cfg IN Config
      SORT cfg.createdAt DESC
      LIMIT 1
      RETURN cfg
    `)
  ).next()
  if (currentConfig) {
    return currentConfig
  } else {
    return await Cfg.save(DefaultConfig, { returnNew: true })
  }
}

const newAccountRequestExpired: AccountingPersistence['newAccountRequestExpired'] = async ({
  flow,
}) => {
  await NewAccountRequest

  const expiredStatus: NewAccountRequestDocumentStatus = 'Confirm Expired'
  const waitingStatus: NewAccountRequestDocumentStatus = 'Waiting Email Confirmation'
  const requestDoc = await (
    await (await db).query(aql`
      LET doc = DOCUMENT(CONCAT("NewAccountRequest/",${flow._key}))
      UPDATE doc
      WITH (
        doc.status == ${waitingStatus}
        ? {
          status:${expiredStatus},
          updatedAt: DATE_NOW()
        }
        : {}
      )
      IN NewAccountRequest
      RETURN NEW
    `)
  ).next()
  return requestDoc
}

export const arangoAccountingPersistenceImpl: AccountingPersistence = {
  addNewAccountRequest,
  confirmNewAccountRequest,
  newAccountRequestExpired,
  isUserNameAvailable,
  activateNewAccount,
  config,
}
