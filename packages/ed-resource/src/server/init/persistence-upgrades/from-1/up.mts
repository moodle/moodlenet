import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Resource } from '../../sys-entities.mjs'

const cursor = await sysEntitiesDB.query(
  `FOR resource IN @@ResourceCollection
UPDATE resource WITH { learningOutcomes: [] } IN @@ResourceCollection
RETURN null`,
  { '@ResourceCollection': Resource.collection.name },
)
cursor.kill()

export default 2
