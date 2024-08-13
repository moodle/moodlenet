import { Collection } from '@moodlenet/collection/server'
import { Resource } from '@moodlenet/ed-resource/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import type { ProfileDataType } from '../../../types.mjs'
import { Profile } from '../../sys-entities.mjs'

const resources: keyof ProfileDataType['publishedContributions'] = 'resources'
const collections: keyof ProfileDataType['publishedContributions'] = 'collections'
const curs = await sysEntitiesDB.query(
  `
  FOR profile in @@ProfileCollection
  UPDATE profile WITH { 
    publishedContributions: {
      ${resources}: LENGTH(
        FOR resource in @@ResourceCollection 
        FILTER resource.published 
                && resource._meta.creatorEntityId == profile._id
        RETURN null
      ),
      ${collections}: LENGTH(
        FOR collection in @@CollectionCollection 
        FILTER collection.published 
                && collection._meta.creatorEntityId == profile._id
        RETURN null
      ),
    } 
  } IN @@ProfileCollection
  RETURN null
`,
  {
    '@ProfileCollection': Profile.collection.name,
    '@ResourceCollection': Resource.collection.name,
    '@CollectionCollection': Collection.collection.name,
  },
)
await curs.kill()

export default 8
