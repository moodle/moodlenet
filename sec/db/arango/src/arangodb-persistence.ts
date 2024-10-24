import { secondaryProvider } from '@moodle/domain'
import { mergeSecondaryAdapters } from '@moodle/domain/lib'
import { ArangoDbSecEnv, getDbStruct } from './db-structure'
import {
  user_profile_secondary_factory,
  user_account_secondary_factory,
  moodlenet_secondary_factory,
  moodlenet_nextjs_secondary_factory,
  org_secondary_factory,
  storage_secondary_factory,
} from './sec'
import { env_secondary_factory } from './sec/env-arango-db'
import { edu_secondary_factory } from './sec/db-arango-edu'
import { content_secondary_factory } from './sec/db-arango-content'
export type { ArangoDbSecEnv } from './db-structure'

export function get_arango_persistence_factory(env: ArangoDbSecEnv): secondaryProvider {
  const dbStruct = getDbStruct(env.database_connections)
  return secondaryContext => {
    const secondaryAdapter = mergeSecondaryAdapters([
      moodlenet_secondary_factory({ dbStruct })(secondaryContext),
      org_secondary_factory({ dbStruct })(secondaryContext),
      user_account_secondary_factory({ dbStruct })(secondaryContext),
      moodlenet_nextjs_secondary_factory({ dbStruct })(secondaryContext),
      user_profile_secondary_factory({ dbStruct })(secondaryContext),
      env_secondary_factory({ dbStruct })(secondaryContext),
      storage_secondary_factory({ dbStruct })(secondaryContext),
      edu_secondary_factory({ dbStruct })(secondaryContext),
      content_secondary_factory({ dbStruct })(secondaryContext),
    ])
    return secondaryAdapter
  }
}
