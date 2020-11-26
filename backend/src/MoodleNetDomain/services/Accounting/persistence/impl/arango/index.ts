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
    console.log('activateNewAccount', flowId)
    const doc = await (
      await db.query(aql`
      LET doc = DOCUMENT(CONCAT("Account/",${flowId._key}))
      UPDATE doc
      WITH {activeFrom:DATE_NOW()}
      IN Account
      RETURN NEW
    `)
    ).next()
    return doc
  },
  async removeNewAccountRequest({ flowId }) {
    return Account.remove({ _key: flowId._key }, { returnOld: true }).then(
      (resp) => resp.old,
      () => undefined
    )
  },
}

module.exports = arangoAccountingPersistenceImpl
export default arangoAccountingPersistenceImpl
