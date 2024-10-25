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
  await dbStruct.data.coll.contentLanguage.create({ cacheEnabled: true })
  await dbStruct.data.coll.contentLicense.create({ cacheEnabled: true })
  await dbStruct.data.coll.eduBloomCognitive.create({ cacheEnabled: true })
  await dbStruct.data.coll.eduIscedField.create({ cacheEnabled: true })
  await dbStruct.data.coll.eduIscedLevel.create({ cacheEnabled: true })
  await dbStruct.data.coll.eduResourceType.create({ cacheEnabled: true })
  await dbStruct.data.coll.userProfile.create({})
  await dbStruct.data.coll.userProfile.ensureIndex({ type: 'persistent', fields: ['userAccount.id'] })

}

