import { aql } from 'arangojs'
import { AccountingPersistence, AccountDocument } from '../../types'
import { db /* log */ } from './account.persistence.arango.env'

export const Account = db.collection<AccountDocument>('Account')

const arangoAccountingPersistenceImpl: AccountingPersistence = {
  async addNewAccountRequest({ req: { email, username }, flowId }) {
    const document: AccountDocument = {
      ...flowId,
      requestAt: new Date(),
      email,
      username,
      activeFrom: null,
    }
    await Account.save(document)
  },
  async activateNewAccount({ flowId }) {
    const doc = await (
      await db.query(aql`
      UPDATE "${flowId._key}"
      WITH {activeFrom:DATE_NOW()}
      IN Account
      RETURN NEW
    `)
    ).next()
    return doc
  },
  async removeNewAccountRequest({ flowId }) {
    const doc = await (
      await db.query(aql`
      REMOVE "${flowId._key}"
      IN Account
      RETURN OLD
    `)
    ).next()
    return doc
  },
}

module.exports = arangoAccountingPersistenceImpl
export default arangoAccountingPersistenceImpl
