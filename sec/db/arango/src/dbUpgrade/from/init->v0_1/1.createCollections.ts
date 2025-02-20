import { dbStruct } from '../../../db-structure'
// import { removePropOnInsert } from '../lib/id'

export async function createCollections({ dbStruct }: { dbStruct: dbStruct }) {
  // logs
  // ~~~`await dbStruct.logs.coll.dbUpgrade.create()~~~ this is created in dbUpgrade.ts

  // userAccount
  await dbStruct.appData.coll.user.create({})
  await dbStruct.appData.coll.user.ensureIndex({
    type: 'persistent',
    name: 'moodlenet.contributor.points',
    fields: ['moodlenet.contributor.points'],
  })
  await dbStruct.appData.coll.user.ensureIndex({
    type: 'persistent',
    name: 'userAccount.user.email.address',
    fields: ['userAccount.user.email.address'],
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

  // modules
  await dbStruct.modules.coll.modelConfig.create({ cacheEnabled: true })
  await dbStruct.modules.coll.modelConfig.ensureIndex({
    type: 'persistent',
    name: 'model',
    fields: ['model'],
    unique: true,
  })
  // services
  await dbStruct.services.coll.domainAccessJob.create({ cacheEnabled: true })
  await dbStruct.services.coll.activeUserSession.create({ cacheEnabled: true })
}
