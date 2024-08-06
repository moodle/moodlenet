import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Resource } from '../../sys-entities.mjs'

await sysEntitiesDB.query(
  `
FOR resource IN @@resourceCollection
REPLACE resource 
  WITH UNSET_RECURSIVE(resource, 'publishingErrors', 'publishRejected') 
  IN @@resourceCollection
`,
  {
    '@resourceCollection': Resource.collection.name,
  },
)

export default 6
