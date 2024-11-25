import { dbStruct } from '../../../db-structure'
// import { removePropOnInsert } from '../lib/id'

export async function createCollections({ dbStruct }: { dbStruct: dbStruct }) {
  // logs
  // ~~~`await dbStruct.logs.coll.migrations.create({ cacheEnabled: true })~~~ this is created in migrate.ts

  // userAccount
  await dbStruct.identity.coll.userAccount.create(/* { computedValues: [removePropOnInsert('id')] } */)
  await dbStruct.identity.coll.userAccount.ensureIndex({
    name: 'userEmail',
    type: 'persistent',
    fields: ['contacts.email'],
    unique: true,
  })
  await dbStruct.appData.coll.userProfile.create({})
  await dbStruct.appData.coll.userProfile.ensureIndex({ type: 'persistent', fields: ['userAccount.id'] })

  // appData
  // --------------

  await dbStruct.appData.coll.moduleConfigs.create({ cacheEnabled: true })
  await dbStruct.appData.coll.contributor.create({ cacheEnabled: true })

  await dbStruct.appData.coll.contentLanguage.create({ cacheEnabled: true })
  await dbStruct.appData.coll.contentLicense.create({ cacheEnabled: true })
  await dbStruct.appData.coll.eduBloomCognitive.create({ cacheEnabled: true })
  await dbStruct.appData.coll.eduIscedField.create({ cacheEnabled: true })
  await dbStruct.appData.coll.eduIscedLevel.create({ cacheEnabled: true })
  await dbStruct.appData.coll.eduResourceType.create({ cacheEnabled: true })
}

