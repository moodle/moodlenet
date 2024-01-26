import { Collection } from '@moodlenet/collection/server'
import { Resource } from '@moodlenet/ed-resource/server'
import '@moodlenet/system-entities/server'
import { toaql } from '@moodlenet/system-entities/server'
import type { WebUserActivityEvents } from '../../types.mjs'
import { pointSystem as P } from '../point-system.mjs'
import type { FeaturedEntityData, UpsertDeltaPointsCfg } from './lib.mjs'
import {
  DELTA_POINTS_ARRAY_AQL_VAR,
  getEntityProfileCreatorEntityIdentifiers,
  getEntityProfileCreatorKey,
  getFeaturedDeltaPoints,
} from './lib.mjs'

export function featuredActivity(
  data: WebUserActivityEvents['feature-entity'],
): UpsertDeltaPointsCfg[] {
  const { action, item, profile: actorProfile, targetEntityDoc } = data
  const targetEntityCreatorId = targetEntityDoc._meta.creatorEntityId
  const isTargetEntityCreator = targetEntityCreatorId === actorProfile._id
  const isSelfReferencing = targetEntityDoc._id === actorProfile._id
  if (!actorProfile.publisher || isTargetEntityCreator || isSelfReferencing) {
    return []
  }
  const originProfileKey = actorProfile._key
  return featuredEntityDeltaPointsConfigs({
    action,
    feat: item,
    originProfileKey,
  })
}
export function featuredEntityDeltaPointsConfigs({
  action,
  originProfileKey,
  feat,
}: {
  action: 'add' | 'remove'
  feat: FeaturedEntityData
  originProfileKey: string
}): UpsertDeltaPointsCfg[] {
  const {
    targetEntityCreator_XOR_targetProfile_DeltaPoints,
    targetEntity_DeltaPopularity,
    actor_DeltaPoints,
  } = getFeaturedDeltaPoints(feat)

  const sign = action === 'add' ? '+' : '-'
  const upsertDeltaConfigsAQLElems: string[] = []
  // give popularity to entity
  upsertDeltaConfigsAQLElems.push(
    `{
      entityType: ${toaql(feat.entityType)},
      entityKey:  ${toaql(feat._key)},
      popularity:{
        overall: ${sign} ${targetEntity_DeltaPopularity} ,
        items:{
          "${feat.feature}": ${sign} 1
        }
      }
    }`,
  )

  // give points to origin profile (actor | origin entity creator)
  upsertDeltaConfigsAQLElems.push(
    `
    {
      entityType: "profile",
      entityKey:  ${toaql(originProfileKey)},
      points: ${sign} ${actor_DeltaPoints}
    }`,
  )

  // give points to target entity creator xor target profile
  // feat.targetEntityProfileCreatorKey &&
  const creatorXORtargetProfileCfg: UpsertDeltaPointsCfg = {
    aqlHead: `
    LET entity = DOCUMENT(${toaql(feat._id)})
    LET creatorXORtargetProfileKey = ${
      feat.entityType === 'profile'
        ? 'entity._key'
        : 'PARSE_IDENTIFIER(entity._meta.creatorEntityId).key'
    }
    LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [
      !creatorXORtargetProfileKey ? null :{
        entityType: "profile",
        entityKey: creatorXORtargetProfileKey,
        points: ${sign} ${targetEntityCreator_XOR_targetProfile_DeltaPoints}
      }
    ][* FILTER CURRENT != null]`,
  }

  return [
    creatorXORtargetProfileCfg,
    {
      aqlHead: `LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [ ${upsertDeltaConfigsAQLElems.join(',')} ]`,
    },
  ]
}

export function collectionResourceListCuration(
  data: WebUserActivityEvents['collection-resource-list-curation'],
): UpsertDeltaPointsCfg[] {
  //! if collection is published (in event )
  const { action, resource, collection } = data
  const collectionCreatorKey = getEntityProfileCreatorKey(collection)
  const resourceCreatorKey = getEntityProfileCreatorKey(resource)
  const resourceKey = resource._key

  if (!collection.published) {
    return []
  }

  const sign = action === 'add' ? '+' : '-'
  const deltaPointsCfgs: UpsertDeltaPointsCfg[] = []

  //!   give/remove list-curation points to/from collection creator
  collectionCreatorKey &&
    deltaPointsCfgs.push({
      aqlHead: `
LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [{
  entityType: 'profile',
  entityKey: ${toaql(collectionCreatorKey)},
  points: ${sign} ${P.contribution.collection.listCuration.toCollectionCreator.points}
}]
`,
    })

  const resourceCreatorIsSomeoneElse =
    !!resourceCreatorKey && resourceCreatorKey !== collectionCreatorKey
  //!  if resource creator is not collection creator
  if (resourceCreatorIsSomeoneElse) {
    //!  give/remove popularity to/from target resource
    deltaPointsCfgs.push({
      aqlHead: `
LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [{
  entityType: 'resource',
  entityKey: ${toaql(resourceKey)},
  popularity:{
    overall: ${sign} ${P.contribution.collection.listCuration.toResource.popularity} ,
    items:{
      "in-collection": ${sign} 1
    }
  }}]
`,
    })

    //!  give/remove list-curation points to/from resource creator
    deltaPointsCfgs.push({
      // resourceCreatorDeltaPoints
      aqlHead: `
LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [
  {
    entityType: 'profile',
    entityKey: ${toaql(resourceCreatorKey)},
    points: ${sign} ${P.contribution.collection.listCuration.toResourceCreator.points}
  }
]
`,
    })
  }
  return deltaPointsCfgs
}
export function switchCollectionPublishing(
  data: WebUserActivityEvents['collection-published' | 'collection-unpublished'],
  published: boolean,
): UpsertDeltaPointsCfg[] {
  const { collection } = data
  //! for each resource in collection
  //       vv collectionResourceListCuration() vv

  const sign = published ? '+' : '-'

  const deltaPointsCfgs: UpsertDeltaPointsCfg[] = []

  const collectionCreatorKey = getEntityProfileCreatorKey(collection)
  if (collectionCreatorKey) {
    deltaPointsCfgs.push({
      aqlHead: `
//! give/remove publishing points to/from publisher
LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [{
  entityType: 'profile',
  entityKey: ${toaql(collectionCreatorKey)}, 
  points: ${sign} ${P.contribution.collection.published.toCreator.points} 
}]`,
    })
  }
  deltaPointsCfgs.push({
    aqlHead: `
  //! for each resource in collection
FOR resourceListItem IN ${toaql(collection.resourceList)}
  LET resource = DOCUMENT(
                          CONCAT(
                                  ${toaql(Resource.collection.name)},
                                  '/',
                                  resourceListItem._key
                                )
                          )
  FILTER resource 
          //! if resource is published 
          && resource.published
  
  LET resourceCreatorKey = PARSE_IDENTIFIER(resource._meta.creatorEntityId).key
  LET collectionCreatorKey = ${toaql(collectionCreatorKey ?? null)}
  
  LET sameCreator = !!collectionCreatorKey 
                    && !!resourceCreatorKey 
                    && resourceCreatorKey == collectionCreatorKey

  LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [
    //!   give/remove list-curation points to/from collection creator
    !collectionCreatorKey ? null :{
      entityType: 'profile',
      entityKey: collectionCreatorKey,
      points: ${sign} ${P.contribution.collection.listCuration.toCollectionCreator.points}
    },
    //! if not same creator give/remove list-curation points to/from resource creator
    (sameCreator || !resourceCreatorKey) ? null : {
      entityType: 'profile',
      entityKey: resourceCreatorKey,
      points: ${sign} ${P.contribution.collection.listCuration.toResourceCreator.points}
    },
    //! if not same creator give/remove list-curation popularity to/from resource
    sameCreator ? null : {
      entityType: 'resource',
      entityKey: resource._key,
      popularity: {
        overall: ${sign} ${P.contribution.collection.listCuration.toResource.popularity},
        items: {
          "in-collection": ${sign} 1
        }
      }
    },
  ][* FILTER CURRENT != null]
  
`,
  })
  return deltaPointsCfgs
}

export function switchResourcePublishing(
  data: WebUserActivityEvents['resource-published' | 'resource-unpublished'],
  published: boolean,
): UpsertDeltaPointsCfg[] {
  const { resource } = data
  const deltaPointsCfgs: UpsertDeltaPointsCfg[] = []

  const sign = published ? '+' : '-'

  const resourceCreatorIds = getEntityProfileCreatorEntityIdentifiers(resource)

  const resourceCreatorKey = resourceCreatorIds?.entityIdentifier._key
  if (resourceCreatorKey) {
    //! give/remove points to resource creator
    deltaPointsCfgs.push({
      aqlHead: `
LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [{
  entityType: 'profile',
  entityKey: ${toaql(resourceCreatorKey)}, 
  points: ${sign} ${P.contribution.resource.published.toCreator.points} 
}]`,
    })
  }

  deltaPointsCfgs.push({
    aqlHead: `
LET resourceCreatorId = ${toaql(resourceCreatorIds?._id ?? null)}
LET resourceCreatorKey = ${toaql(resourceCreatorIds?.entityIdentifier._key ?? null)}
LET resourceKey = ${toaql(resource._key)} 
//! for each collection containing the resource
FOR collection IN \`${Collection.collection.name}\`

FILTER    //! if collection published 
          collection.published
          //! has a creatorId          
          && collection._meta.creatorEntityId 
          //!  not same creator as resource creator 
          && collection._meta.creatorEntityId != resourceCreatorId
          //! contains the resource
          && resourceKey IN collection.resourceList[*]._key

  LET collectionCreatorKey = PARSE_IDENTIFIER(collection._meta.creatorEntityId).key
  LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [
    //! give/remove list-curation points to/from collection creator
    !collectionCreatorKey ? null : {
      entityType: 'profile',
      entityKey: collectionCreatorKey, 
      points: ${sign} ${P.contribution.collection.listCuration.toCollectionCreator.points} 
    },
    //! give/remove list-curation points to/from resource creator
    !resourceCreatorKey ? null :{
      entityType: 'profile',
      entityKey: resourceCreatorKey, 
      points: ${sign} ${P.contribution.collection.listCuration.toResourceCreator.points} 
    },
  ][* FILTER CURRENT != null]
`,
  })
  // console.log({ creatorPointsDeltaConfig, collectionsAndCreatorsPointsDeltaConfig })
  return deltaPointsCfgs
}

export function userPublishingPermissionChange({
  profileKey,
  permission,
}: {
  permission: 'given' | 'revoked'
  profileKey: string
}) {
  const deltaPointsCfgs: UpsertDeltaPointsCfg[] = []

  const sign = permission === 'given' ? '+' : '-'

  deltaPointsCfgs.push({
    aqlHead: `
LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [{
  entityType: 'profile',
  entityKey: ${toaql(profileKey)}, 
  points: ${sign} ${P.engagement.profile.publisher.points} 
}]`,
  })

  // unpublish all in srv
  // unfeature all in srv
  // const featuredAction = permission === 'given' ? 'add' : 'remove'
  // const featuredEntitiesDeltaPoints = knownFeaturedEntities
  //   .map(async item => {
  //     const targetEntityCreator = await getEntityCreatorProfile({ entityId: item._id })
  //     const targetEntityProfileCreatorKey =
  //       targetEntityCreator && getEntityProfileCreatorKey(targetEntityCreator)

  //     return featuredEntityDeltaPointsConfigs({
  //       action: featuredAction,
  //       feat: { ...item, targetEntityProfileCreatorKey },
  //       originProfileKey: profileKey,
  //     })
  //   })
  //   .flat()
  return deltaPointsCfgs
}

export function profileInterestsFirstSet(data: WebUserActivityEvents['edit-profile-interests']) {
  const deltaPointsCfgs: UpsertDeltaPointsCfg[] = []

  //! if first set
  if (data.oldProfileInterests) {
    return []
  }
  const { profileKey } = data

  deltaPointsCfgs.push(
    //! give points to/from usr
    {
      aqlHead: `
LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [{
  entityType: 'profile',
  entityKey: ${toaql(profileKey)}, 
  points: ${P.engagement.profile.interestsSet.points} 
}]`,
    },
  )
  return deltaPointsCfgs
}

export function editProfileMeta(data: WebUserActivityEvents['edit-profile-meta']) {
  const deltaPointsCfgs: UpsertDeltaPointsCfg[] = []

  const { oldMeta, meta, profileKey } = data
  const deltaAmountOfSetfields =
    Object.values(meta)
      .map(val => ('string' === typeof val ? val.trim() : val))
      .filter(val => !!val).length -
    Object.values(oldMeta)
      .map(val => ('string' === typeof val ? val.trim() : val))
      .filter(val => !!val).length

  //! give/remove points to/from collection owner based on meta changes
  deltaPointsCfgs.push({
    aqlHead: `
LET ${DELTA_POINTS_ARRAY_AQL_VAR} = [{
  entityType: 'profile',
  entityKey: ${toaql(profileKey)}, 
  points: ${deltaAmountOfSetfields * P.engagement.profile.perMetaDataField.points} 
}]`,
  })
  return deltaPointsCfgs
}

// export function deletedWebUserAccount() {
//! ** do all the followings in the srvevt handler ?
//! delete all unpublished contributions
//! if publisher
//!   revoke publishing permission
//!-- NO! await unpublishAllProfileContributions(profile._key)
// }

// export function resourceDownloaded() {
//! give popularity to resource
//! NOPE give points to resource owner
//! NOPE give points to downloader
// }

// export function collectionUpdatedMeta({
//   profileKey,
//   newCollectionMeta,
//   oldCollectionMeta,
// }: {
//   newCollectionMeta: CollectionMeta
//   oldCollectionMeta: CollectionMeta
//   profileKey: string
// }) {
//   const deltaAmountOfSetfields =
//     Object.values(newCollectionMeta)
//       .map(val => ('string' === typeof val ? val.trim() : val))
//       .filter(val => !!val).length -
//     Object.values(oldCollectionMeta)
//       .map(val => ('string' === typeof val ? val.trim() : val))
//       .filter(val => !!val).length

//   const profilePointsDeltaConfig: UpsertDeltaPointsCfg = {
//     aqlHead: `
// LET ${DELTA_POINTS_ELEMS} = [{
//   entityType: 'profile',
//   entityKey: ${toaql(profileKey)},
//   points: ${deltaAmountOfSetfields * P.contribution.collection.perMetaDataField.points}
// }]`,
//   }
//   return [profilePointsDeltaConfig]
//   //! give/remove points to/from collection owner based on meta changes
// }
// export function resourceUpdatedMeta({
//   profileKey,
//   newCollectionMeta,
//   oldCollectionMeta,
// }: {
//   newCollectionMeta: ResourceMeta
//   oldCollectionMeta: CollectionMeta
//   profileKey: string
// }) {
//   const deltaAmountOfSetfields =
//     Object.values(newCollectionMeta)
//       .map(val => ('string' === typeof val ? val.trim() : val))
//       .filter(val => !!val).length -
//     Object.values(oldCollectionMeta)
//       .map(val => ('string' === typeof val ? val.trim() : val))
//       .filter(val => !!val).length

//   const profilePointsDeltaConfig: UpsertDeltaPointsCfg = {
//     aqlHead: `
// LET ${DELTA_POINTS_ELEMS} = [{
//   entityType: 'profile',
//   entityKey: ${toaql(profileKey)},
//   points: ${deltaAmountOfSetfields * P.contribution.collection.perMetaDataField.points}
// }]`,
//   }
//   return [profilePointsDeltaConfig]
//   //! give/remove points to/from resource owner based on meta changes
// }
