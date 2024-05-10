import type { CollectionDataType } from '@moodlenet/collection/server'
import * as collectionSrv from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import { getEntityIdentifiersByKey } from '@moodlenet/system-entities/common'
import type { EntityFullDocument } from '@moodlenet/system-entities/server'
import { isSameClass, sysEntitiesDB } from '@moodlenet/system-entities/server'
import type { ProfileDataType, WebUserActivityEvents } from '../../exports.mjs'
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
    { retryOnConflict: 15 },
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
    { retryOnConflict: 15 },
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

export async function maintainProfilePublishedContributionCount(
  activity: EventPayload<
    Pick<
      WebUserActivityEvents,
      | 'collection-published'
      | 'collection-unpublished'
      | 'resource-published'
      | 'resource-unpublished'
    >
  >,
) {
  if (!isSameClass(activity.data.userId.entityClass, Profile.entityClass)) {
    return
  }
  const profileKey = activity.data.userId._key
  const { _id: profileId } = getEntityIdentifiersByKey({
    ...activity.data.userId.entityClass,
    _key: profileKey,
  })

  const contribEdits = ((): null | {
    contribType: keyof ProfileDataType['publishedContributions']
    delta: number
  } => {
    switch (activity.event) {
      case 'collection-published':
        return { contribType: 'collections', delta: 1 }
      case 'collection-unpublished':
        return { contribType: 'collections', delta: -1 }
      case 'resource-published':
        return { contribType: 'resources', delta: 1 }
      case 'resource-unpublished':
        return { contribType: 'resources', delta: -1 }
      default:
        return null
    }
  })()

  if (!contribEdits) {
    return
  }
  const { contribType, delta } = contribEdits
  const curs = await sysEntitiesDB.query(
    `
    LET profile = DOCUMENT(@profileId)
    UPDATE profile WITH { 
      publishedContributions: {
        ${contribType}: profile.publishedContributions.${contribType} + (@delta) 
      } 
    } IN @@ProfileCollection
    RETURN null
  `,
    { '@ProfileCollection': Profile.collection.name, profileId, delta },
  )
  await curs.kill()
}
