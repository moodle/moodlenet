import { aql } from 'arangojs'
import { AccountingPersistence, AccountDocument } from '../../types'
import { db /* log */ } from './account.persistence.arango.env'

export const Account = db.collection<AccountDocument>('Account')

export const arangoAccountingPersistenceImpl: AccountingPersistence = {
  async addNewAccountRequest({ req: { email, username }, flow }) {
    const document: AccountDocument = {
      ...flow,
      requestAt: new Date(),
      email,
      username,
      activeFrom: null,
    }
    await Account.save(document)
  },
  async activateNewAccount({ flow }) {
    console.log('activateNewAccount', flow)
    const doc = await (
      await db.query(aql`
      LET doc = DOCUMENT(CONCAT("Account/",${flow._key}))
      UPDATE doc
      WITH {activeFrom:DATE_NOW()}
      IN Account
      RETURN NEW
    `)
    ).next()
    return doc
  },
  async removeNewAccountRequest({ flow }) {
    return Account.remove({ _key: flow._key }, { returnOld: true }).then(
      (resp) => resp.old,
      () => undefined
    )
  },
}
