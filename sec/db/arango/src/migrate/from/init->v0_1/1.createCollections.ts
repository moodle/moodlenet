import { dbStruct } from '../../../db-structure'
// import { removePropOnInsert } from '../lib/id'

export async function createCollections({ dbStruct }: { dbStruct: dbStruct }) {
  // mng
  await dbStruct.modules.coll.moduleConfigs.create({ cacheEnabled: true })

  // userAccount
  await dbStruct.userAccount.coll.user.create(/* { computedValues: [removePropOnInsert('id')] } */)
  await dbStruct.userAccount.coll.user.ensureIndex({
    name: 'userEmail',
    type: 'persistent',
    fields: ['contacts.email'],
    unique: true,
  })
  // data
  // --------------
  await dbStruct.data.coll.xxx.create({})
  ----------- more collections ---------------
  ----------- more indexes ---------------
}
