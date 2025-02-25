import { ArangoDbSecEnv, getDbStruct } from './db-structure'
import { content, education, modelConfigs, moodlenet, userAccount } from './models'
export type { ArangoDbSecEnv } from './db-structure'

export function get_arango_persistence_factory(env: ArangoDbSecEnv) {
  const dbStruct = getDbStruct(env.database_connections)
  const modelImpl: moo.model.impl = {
    education: education.educationImpl({ dbStruct }),
    content: content.contentImpl({ dbStruct }),
    configs: modelConfigs.modelConfigs({ dbStruct }),
    moodlenet: moodlenet.moodlenetImpl({ dbStruct }),
    userAccount: userAccount.userAccountImpl({ dbStruct }),
  }

  return { modelImpl, dbStruct }
}
