import { aql } from 'arangojs'
import { AccountingPersistence, AccountDocument } from '../../types'
import { db /* log */ } from './account.persistence.arango.env'

export const Account = db.collection<AccountDocument>('Account')

const arangoAccountingPersistenceImpl: AccountingPersistence = {
  async addNewAccountRequest({ request: { email, username } }) {
    const document: AccountDocument = {
      requestAt: new Date(),
      email,
      username,
      activeFrom: null,
    }
    const key = await (
      await db.query(aql`
      INSERT ${document} 
      INTO Account
      RETURN NEW._key
    `)
    ).next()
    return key
  },
  async activateNewAccount({ key }) {
    const doc = await (
      await db.query(aql`
      UPDATE "${key}"
      WITH {activeFrom:DATE_NOW()}
      IN Account
      RETURN NEW
    `)
    ).next()
    return doc
  },
  async removeNewAccountRequest({ key }) {
    const doc = await (
      await db.query(aql`
      REMOVE "${key}"
      IN Account
    `)
    ).next()
    return doc
  },
}

module.exports = arangoAccountingPersistenceImpl
export default arangoAccountingPersistenceImpl
