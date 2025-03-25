import { dbStruct } from '../../../db-structure'
// import { removePropOnInsert } from '../lib/id'

export async function createCollections({ dbStruct }: { dbStruct: dbStruct }) {
  // logs

  // userHome
  await dbStruct.appData.coll.userHome.create({})
  await dbStruct.appData.coll.userHome.ensureIndex({
    type: 'persistent',
    name: 'moodlenet.contributor.points',
    fields: ['moodlenet.contributor.points'],
  })
  await dbStruct.appData.coll.userHome.ensureIndex({
    type: 'persistent',
    name: 'userHome.user.email.address',
    fields: ['userHome.user.email.address'],
    unique: true,
  })

  // appData
  // --------------

  await dbStruct.appData.coll.contentLanguage.create({ cacheEnabled: true })
  await dbStruct.appData.coll.contentLicense.create({ cacheEnabled: true })
  await dbStruct.appData.coll.eduBloomCognitive.create({ cacheEnabled: true })
  await dbStruct.appData.coll.eduIscedField.create({ cacheEnabled: true })
  await dbStruct.appData.coll.eduIscedLevel.create({ cacheEnabled: true })
  await dbStruct.appData.coll.eduResourceType.create({ cacheEnabled: true })
  await dbStruct.appData.coll.staticData.create({ cacheEnabled: true })
  await dbStruct.appData.coll.staticData.ensureIndex({
    type: 'persistent',
    name: 'modelName',
    fields: ['modelName'],
    unique: true,
  })

  // services
  // ~~~`await dbStruct.logs.coll.dbUpgrade.create()~~~ this is created in dbUpgrade.ts
  await dbStruct.services.coll.modelUpgrade.create({ cacheEnabled: true })
  await dbStruct.services.coll.modelEnvelopeQueue.create({ cacheEnabled: true })
  await dbStruct.services.coll.activeAuthSession.create({ cacheEnabled: true })
}
