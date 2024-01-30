import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Resource } from '../../sys-entities.mjs'

await sysEntitiesDB.query(
  `
FOR resource IN @@resourceCollection
FILTER !resource.content
REMOVE resource IN @@resourceCollection
`,
  {
    '@resourceCollection': Resource.collection.name,
  },
)

await sysEntitiesDB.query(
  `
FOR resource IN @@resourceCollection
UPDATE resource WITH {
  persistentContext:{
    generatedData: null ,
    publishRejected: null ,
    publishingErrors: null ,
    state: resource.published ? 'Published' :'Unpublished'
  }
} IN @@resourceCollection
`,
  {
    '@resourceCollection': Resource.collection.name,
  },
)

export default 4
