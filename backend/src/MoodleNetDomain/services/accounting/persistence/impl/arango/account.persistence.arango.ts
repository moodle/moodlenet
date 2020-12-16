import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import { DefaultConfig } from '../../../assets/defaultConfig'
import {
  AccountDocument,
  AccountingPersistence,
  ChangeAccountEmailRequestDocument,
  ChangeAccountEmailRequestDocumentStatus,
  Config,
  NewAccountRequestDocument,
  NewAccountRequestDocumentStatus,
} from '../../types'
import { DBReady } from './account.persistence.arango.env'

export const arangoAccountingPersistence: Promise<AccountingPersistence> = DBReady.then(
  ({ db, Config, NewAccountRequest, Account }) => {
    const getAccountByUsername: AccountingPersistence['getAccountByUsername'] = async ({
      username,
    }) => {
      const mAccount = await Account.document(username)
      return mAccount
    }

    const addChangeAccountEmailRequest: AccountingPersistence['addChangeAccountEmailRequest'] = async ({
      flow,
      req: { newEmail, username },
    }) => {
      if (await isAccountOrOpenRequestWithEmailPresent({ email: newEmail })) {
        return 'account or request with this email already present'
      }

      const document: Omit<ChangeAccountEmailRequestDocument, 'createdAt' | 'updatedAt'> = {
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

    const confirmAccountEmailChangeRequest: AccountingPersistence['confirmAccountEmailChangeRequest'] = async ({
      flow,
    }) => {
      const confirmedStatus: NewAccountRequestDocumentStatus = 'Email Confirmed'

      const cursor = await db.query(aql`
        LET doc = DOCUMENT(CONCAT("ChangeAccountEmailRequest/",${flow._key}))
        LET alreadyConfirmed = doc.status == ${confirmedStatus}
        UPDATE doc
        WITH (alreadyConfirmed
          ? {}
          : {
            status:${confirmedStatus},
            updatedAt: DATE_NOW()
          })
        IN ChangeAccountEmailRequest
        RETURN (alreadyConfirmed ? true : NEW)
      `)
      const confirmRes: Maybe<ChangeAccountEmailRequestDocument | true> = await cursor.next()

      if (!confirmRes) {
        return 'Request Not Found'
      }

      if (confirmRes === true) {
        return 'Previously Confirmed'
      }

      await Account.update(confirmRes.username, { email: confirmRes.newEmail })

      return 'Confirmed'
    }

    const changeAccountEmailRequestExpired: AccountingPersistence['changeAccountEmailRequestExpired'] = async ({
      flow,
    }) => {
      const expiredStatus: ChangeAccountEmailRequestDocumentStatus = 'Confirm Expired'
      const waitingStatus: ChangeAccountEmailRequestDocumentStatus = 'Waiting Email Confirmation'
      const cursor = await db.query(aql`
        LET doc = DOCUMENT(CONCAT("ChangeAccountEmailRequest/",${flow._key}))
        UPDATE doc
        WITH (
          doc.status == ${waitingStatus}
          ? {
            status:${expiredStatus},
            updatedAt: DATE_NOW()
          }
          : {}
        )
        IN ChangeAccountEmailRequest
        RETURN NEW
      `)
      const requestDoc: Maybe<ChangeAccountEmailRequestDocument> = await cursor.next()
      return requestDoc
    }

    // TODO: should it check on change email requests too ?
    const isAccountOrOpenRequestWithEmailPresent = async ({ email }: { email: string }) => {
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

    const addNewAccountRequest: AccountingPersistence['addNewAccountRequest'] = async ({
      req: { email },
      flow,
    }) => {
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

    const activateNewAccount: AccountingPersistence['activateNewAccount'] = async ({
      requestFlowKey,
      password,
      username,
    }) => {
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

    const confirmNewAccountRequest: AccountingPersistence['confirmNewAccountRequest'] = async ({
      flow,
    }) => {
      const confirmedStatus: NewAccountRequestDocumentStatus = 'Email Confirmed'

      const cursor = await db.query(aql`
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
      const confirmRes: Maybe<NewAccountRequestDocument | true> = await cursor.next()

      if (!confirmRes) {
        return 'Request Not Found'
      }

      if (confirmRes === true) {
        return 'Previously Confirmed'
      }

      return 'Confirmed'
    }

    const isUserNameAvailable: AccountingPersistence['isUserNameAvailable'] = async ({
      username,
    }) => {
      const cursor = await db.query(aql`
        FOR doc IN Account
        FILTER doc.username==${username}
        LIMIT 1
        RETURN doc 
      `)
      const accountWithSameUsername: Maybe<AccountDocument> = await cursor.next()
      return !accountWithSameUsername
    }

    const config: AccountingPersistence['config'] = async () => {
      const cursor = await db.query(aql`
      FOR cfg IN Config
      SORT cfg.createdAt DESC
      LIMIT 1
      RETURN cfg
    `)
      const currentConfig: Maybe<Config> = await cursor.next()
      if (currentConfig) {
        return currentConfig
      } else {
        const savedDefaultConfig = await Config.save(DefaultConfig, { returnNew: true })
        const config = savedDefaultConfig.new
        if (!config) {
          throw new Error(`couldn't save default config`)
        }
        return config
      }
    }

    const newAccountRequestExpired: AccountingPersistence['newAccountRequestExpired'] = async ({
      flow,
    }) => {
      const expiredStatus: NewAccountRequestDocumentStatus = 'Confirm Expired'
      const waitingStatus: NewAccountRequestDocumentStatus = 'Waiting Email Confirmation'
      const cursor = await db.query(aql`
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
      const requestDoc: Maybe<NewAccountRequestDocument> = await cursor.next()
      return requestDoc
    }

    const changePassword: AccountingPersistence['changePassword'] = async ({
      newPassword,
      username,
    }) => {
      const resp = await Account.update(username, { password: newPassword }, { returnNew: true })
      return resp.new ? true : 'not found'
    }

    return {
      changePassword,
      addNewAccountRequest,
      confirmNewAccountRequest,
      newAccountRequestExpired,
      isUserNameAvailable,
      activateNewAccount,
      config,
      getAccountByUsername,
      addChangeAccountEmailRequest,
      confirmAccountEmailChangeRequest,
      changeAccountEmailRequestExpired,
    }
  }
)
