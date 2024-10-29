import { dbStruct } from '../../../db-structure'
// import { removePropOnInsert } from '../lib/id'

export async function createCollections({ dbStruct }: { dbStruct: dbStruct }) {
  // mng
  // ~~~`await dbStruct.modules.coll.migrations.create({ cacheEnabled: true })~~~ this is created in migrate.ts
  await dbStruct.modules.coll.moduleConfigs.create({ cacheEnabled: true })

  // userAccount
  await dbStruct.userAccount.coll.userAccount.create(/* { computedValues: [removePropOnInsert('id')] } */)
  await dbStruct.userAccount.coll.userAccount.ensureIndex({
    name: 'userEmail',
    type: 'persistent',
    fields: ['contacts.email'],
    unique: true,
  })
  await dbStruct.userAccount.coll.userProfile.create({})
  await dbStruct.userAccount.coll.userProfile.ensureIndex({ type: 'persistent', fields: ['userAccount.id'] })

  // data
  // --------------

  await dbStruct.moodlenet.coll.contentLanguage.create({ cacheEnabled: true })
  await dbStruct.moodlenet.coll.contentLicense.create({ cacheEnabled: true })
  await dbStruct.moodlenet.coll.eduBloomCognitive.create({ cacheEnabled: true })
  await dbStruct.moodlenet.coll.eduIscedField.create({ cacheEnabled: true })
  await dbStruct.moodlenet.coll.eduIscedLevel.create({ cacheEnabled: true })
  await dbStruct.moodlenet.coll.eduResourceType.create({ cacheEnabled: true })
  await dbStruct.moodlenet.coll.eduResourceType.create({ cacheEnabled: true })
}

