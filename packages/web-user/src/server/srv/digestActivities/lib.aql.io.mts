import type { CollectionDataType } from '@moodlenet/collection/server'
import * as collectionSrv from '@moodlenet/collection/server'
import type { EntityFullDocument } from '@moodlenet/system-entities/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Profile } from '../../exports.mjs'
import { EntityPoints } from '../../init/sys-entities.mjs'
import type { UpsertDeltaPointsCfg } from './lib.mjs'
import { DELTA_POINTS_ARRAY_AQL_VAR } from './lib.mjs'

export async function removeFeaturedFromAllUsers({
  featuredEntityId,
}: {
  featuredEntityId: string
}) {
  sysEntitiesDB.query(
    `
FOR profile IN \`${Profile.collection.name}\`
  FILTER @featuredEntityId IN profile.knownFeaturedEntities[*]._id
  LET filteredFeats = profile.knownFeaturedEntities[* FILTER CURRENT._id != @featuredEntityId] 
  UPDATE profile WITH { knownFeaturedEntities: filteredFeats } IN \`${Profile.collection.name}\`
`,
    { featuredEntityId },
    { retryOnConflict: 5 },
  )
}
export async function removeResourceFromAllCollections({ resourceKey }: { resourceKey: string }) {
  /*   const cursor = */ await sysEntitiesDB.query<EntityFullDocument<CollectionDataType>>(
    `
FOR collection IN \`${collectionSrv.Collection.collection.name}\`
  FILTER @resourceKey IN collection.resourceList[*]._key
  LET filteredResourceList = collection.resourceList[* FILTER CURRENT._key != @resourceKey] 
  UPDATE collection WITH { resourceList: filteredResourceList } IN \`${collectionSrv.Collection.collection.name}\`
  RETURN NEW
`,
    { resourceKey },
    { retryOnConflict: 5 },
  )
}

// export async function getEntityCreatorProfile({ entityId }: { entityId: string }) {
//   if (!WebUserEntitiesTools.isIdOfType({ id: entityId, type: 'Profile' })) {
//     return
//   }
//   const docCursor = await sysEntitiesDB.query<EntityFullDocument<ProfileDataType>>(
//     `
//   RETURN DOCUMENT(@entityId)
//   `,
//     { entityId },
//   )
//   const doc = await docCursor.next()
//   if (!doc) {
//     return
//   }
//   return doc
// }

export async function upsertDeltaPoints(cfgs: UpsertDeltaPointsCfg[]) {
  // console.log('upsertDeltaPoints', cfgs)
  const upsertDeltaPointsQueries = cfgs.map(
    ({ aqlHead }) => `
${aqlHead}
FOR deltaPointsElem IN ${DELTA_POINTS_ARRAY_AQL_VAR}
  LET ENTITY_KEY               = deltaPointsElem.entityKey
  LET ENTITY_TYPE              = deltaPointsElem.entityType
  LET DELTA_POINTS             = deltaPointsElem.points || 0
  LET DELTA_POPULARITY_ITEMS    = deltaPointsElem.popularity.items || {}
  LET DELTA_POPULARITY_OVERALL  = deltaPointsElem.popularity.overall || 0
  LET pointRecordKey          = CONCAT(ENTITY_TYPE,"::",ENTITY_KEY)
  UPSERT { _key: pointRecordKey }
  INSERT {
    synced: false,
    _key: pointRecordKey,
    entityKey: ENTITY_KEY,
    entityType: ENTITY_TYPE,
    points: DELTA_POINTS,
    popularity: {
      overall: DELTA_POPULARITY_OVERALL,
      items: DELTA_POPULARITY_ITEMS
    }
  }
  UPDATE {
    synced: false,
    points: MAX([ 0, ( DELTA_POINTS || 0 ) + ( OLD.points || 0 ) ]),
    popularity:{
      overall: MAX([ 0, ( DELTA_POPULARITY_OVERALL || 0 ) + ( OLD.popularity.overall || 0 ) ]),
      items: ZIP(
        UNION_DISTINCT( ATTRIBUTES(DELTA_POPULARITY_ITEMS  || {}), ATTRIBUTES(OLD.popularity.items  || {}) ),
        (
          FOR itemName IN UNION_DISTINCT( ATTRIBUTES(DELTA_POPULARITY_ITEMS  || {}), ATTRIBUTES(OLD.popularity.items  || {}) )
            
            LET deltaItemAmount = DELTA_POPULARITY_ITEMS[itemName] || 0
            LET oldItemAmount   = OLD.popularity.items[itemName] || 0

            LET sumItemAmount   = deltaItemAmount + oldItemAmount 
            return MAX([ 0, sumItemAmount ])
        )
      )
    }
  } IN @@entityPointsCollection
`,
  )

  upsertDeltaPointsQueries.forEach(upsertDeltaPointsQuery => {
    sysEntitiesDB
      .query(
        upsertDeltaPointsQuery,
        {
          '@entityPointsCollection': EntityPoints.collection.name,
        },
        { retryOnConflict: 50 },
      )
      .catch(err => {
        console.error('Error in upsertDeltaPointsQuery:::\n', upsertDeltaPointsQuery)
        throw err
      })
  })
}
