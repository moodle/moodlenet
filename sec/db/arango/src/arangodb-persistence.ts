import { ArangoDbSecEnv, getDbStruct } from './db-structure'
import { content, education, statics, moodlenet, userHome } from './models'
export type { ArangoDbSecEnv } from './db-structure'

export function get_arango_persistence_factory(env: ArangoDbSecEnv) {
  const dbStruct = getDbStruct(env.database_connections)
  const modelImpl: moo.def.model.impl = {
    education: education.educationImpl({ dbStruct }),
    content: content.contentImpl({ dbStruct }),
    statics: statics.staticsImpl({ dbStruct }),
    moodlenet: moodlenet.moodlenetImpl({ dbStruct }),
    userHome: userHome.userHomeImpl({ dbStruct }),
  }

  return { modelImpl, dbStruct }
}
