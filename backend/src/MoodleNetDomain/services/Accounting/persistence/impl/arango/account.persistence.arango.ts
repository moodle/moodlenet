import { aql } from 'arangojs'
import { createDocumentCollectionIfNotExists } from '../../../../../../lib/helpers/arango'
import { AccountingPersistence, AccountDocument } from '../../types'
import { db /* log */ } from './account.persistence.arango.env'

export const Account = createDocumentCollectionIfNotExists<AccountDocument>({
  name: 'Account',
  db,
  createOpts: {},
})

export const arangoAccountingPersistenceImpl: AccountingPersistence = {
  async addNewAccountRequest({ req: { email, username }, flow }) {
    const document: AccountDocument = {
      ...flow,
      requestAt: new Date(),
      email,
      username,
      activeFrom: null,
    }
    await (await Account).save(document)
  },
  async activateNewAccount({ flow }) {
    console.log('activateNewAccount', flow)
    const doc = await (
      await (await db).query(aql`
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
    return (await Account).remove({ _key: flow._key }, { returnOld: true }).then(
      (resp) => resp.old,
      () => undefined
    )
  },
}
