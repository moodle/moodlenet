import type { Document } from '@moodlenet/system-entities/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import type { KnownEntityType } from '../../common/types.mjs'
import { EntityPoints } from '../init/sys-entities.mjs'
import { getEntityCollectionHandle, getEntityIdByKnownEntity } from '../srv/known-entity-types.mjs'
import type { EntityPointsDataType } from '../types.mjs'

const TIMEOUT_WHEN_NO_MORE_SO_FAR = 5000
const BATCH_SIZE = 100
type EntityPointsSyncLoopHandle = { to: null | NodeJS.Timeout; entityType: KnownEntityType }
export const entityPointsSyncLoopHandles = (function startAllEntityPointsSyncLoops() {
  const entityTypes: ReadonlyArray<KnownEntityType> = [
    'collection',
    'resource',
    'profile',
    'subject',
  ]
  return entityTypes.map(entityType => {
    const { collection: entityCollection } = getEntityCollectionHandle({ entityType })
    const loopHandle: EntityPointsSyncLoopHandle = {
      to: null,
      entityType,
    }
    nextEntityPointsSyncBatch()
    return loopHandle
    async function nextEntityPointsSyncBatch() {
      const noMoreSoFar = await syncSomeEntityPoints()
      const nextBatchAfter = noMoreSoFar ? TIMEOUT_WHEN_NO_MORE_SO_FAR : 0
      loopHandle.to = setTimeout(nextEntityPointsSyncBatch, nextBatchAfter)

      async function syncSomeEntityPoints(): Promise<boolean> {
        const entityPointsToSyncCursor = await sysEntitiesDB.query<Document<EntityPointsDataType>>(
          `
          FOR entityPoint IN @@entityPointsCollection
            FILTER entityPoint.entityType == @entityType
                    && !entityPoint.synced
            LIMIT ${BATCH_SIZE}
            RETURN entityPoint
        `,
          {
            entityType,
            '@entityPointsCollection': EntityPoints.collection.name,
          },
        )
        const entityPointsToSync = await entityPointsToSyncCursor.all()
        const syncingEntityPointsAmount = entityPointsToSync.length
        if (!syncingEntityPointsAmount) {
          return true
        }
        console.log(
          `syncing ${syncingEntityPointsAmount} ${entityType} points:\n`,
          entityPointsToSync
            .map(
              ({ entityType, entityKey, points, popularity }) =>
                `${entityType}#${entityKey}:[p:${points ?? ''}/o:${popularity?.overall ?? ''}]`,
            )
            .join('\n'),
          '\n',
        )
        const syncingEntityIds = entityPointsToSync.map(entityPointsData =>
          getEntityIdByKnownEntity({
            _key: entityPointsData.entityKey,
            entityType: entityType,
          }),
        )
        const syncingEntityPointsMap = entityPointsToSync.reduce((aggr, entityPointsData) => {
          aggr[entityPointsData.entityKey] = {
            points: entityPointsData.points,
            popularity: entityPointsData.popularity,
          }
          return aggr
        }, {} as Record<string, Pick<EntityPointsDataType, 'points' | 'popularity'>>)

        const syncedEntitiesPointsPromise = sysEntitiesDB.query<EntityPointsDataType>(
          `
          LET syncingEntityPointsMap = @syncingEntityPointsMap
          FOR entityId IN @syncingEntityIds
            LET entity = DOCUMENT(entityId)
            FILTER entity 
            LET entityPoints = syncingEntityPointsMap[entity._key]
            FILTER entityPoints 
            UPDATE entity WITH entityPoints IN @@entityCollection
        `,
          {
            syncingEntityIds,
            syncingEntityPointsMap,
            '@entityCollection': entityCollection.name,
          },
          { retryOnConflict: 50 },
        )

        const syncingEntityPointsSyncIdRevList = entityPointsToSync.map(entityPointsData => ({
          _id: entityPointsData._id,
          _rev: entityPointsData._rev,
        }))
        const markedEntityPointsRecordsAsSyncPromise = sysEntitiesDB.query<
          Document<EntityPointsDataType>
        >(
          `
          FOR syncingEntityPointsSyncIdRev IN @syncingEntityPointsSyncIdRevList
            LET entityPoint = DOCUMENT(syncingEntityPointsSyncIdRev._id)
            FILTER entityPoint._rev == syncingEntityPointsSyncIdRev._rev
            UPDATE entityPoint WITH { synced: true } IN @@entityPointsCollection
            RETURN entityPoint
        `,
          {
            syncingEntityPointsSyncIdRevList,
            '@entityPointsCollection': EntityPoints.collection.name,
          },
        )

        await Promise.all([syncedEntitiesPointsPromise, markedEntityPointsRecordsAsSyncPromise])

        return false
      }
    }
  })
})()
