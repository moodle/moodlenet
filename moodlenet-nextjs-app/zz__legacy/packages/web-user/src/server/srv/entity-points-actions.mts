import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import type { KnownEntityType } from '../../common/types.mjs'
import { EntityPoints } from '../init/sys-entities.mjs'

export async function deleteEntityPointsRecord({
  entity,
}: {
  entity: { type: KnownEntityType; key: string }
}) {
  const cursor = await sysEntitiesDB.query(
    `
    FOR entityPoint IN @@entityPointsCollection
    FILTER entityPoint.entityType == @entityType
            && entityPoint.entityKey == @entityKey
    REMOVE entityPoint IN @@entityPointsCollection
    RETURN entityPoint 
  `,
    {
      'entityType': entity.type,
      'entityKey': entity.key,
      '@entityPointsCollection': EntityPoints.collection.name,
    },
  )
  await cursor.all()
  await cursor.kill()
}
