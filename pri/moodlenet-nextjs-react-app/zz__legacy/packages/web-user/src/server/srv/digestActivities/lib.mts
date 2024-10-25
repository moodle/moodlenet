import assert from 'assert'
import { pointSystem as P } from '../../../common/gamification/point-system.mjs'
import type { KnownEntityType } from '../../../common/types.mjs'
import type { KnownFeaturedEntityItem } from '../../exports.mjs'
import { WebUserEntitiesTools } from '../../exports.mjs'
import {
  getEntityCollectionHandle,
  getEntityIdByKnownEntity,
  getEntityToolByKnownEntity,
} from '../known-entity-types.mjs'
export const DELTA_POINTS_ARRAY_AQL_VAR = 'deltaPointsElems'
export type UpsertDeltaPointsCfg = { aqlHead: string }

export function getEntityProfileCreatorKey(entity: { _meta: { creatorEntityId?: null | string } }) {
  return getEntityProfileCreatorEntityIdentifiers(entity)?.entityIdentifier._key
}

export function getEntityProfileCreatorEntityIdentifiers(entity: {
  _meta: { creatorEntityId?: null | string }
}) {
  if (!entity._meta.creatorEntityId) {
    return
  }
  return WebUserEntitiesTools.getIdentifiersById({
    _id: entity._meta.creatorEntityId,
    type: 'Profile',
  })
}

export type FeaturedEntityData = Pick<
  KnownFeaturedEntityItem,
  '_key' | 'entityType' | 'feature' | '_id'
>

export function getFeaturedDeltaPoints(feat: FeaturedEntityData) {
  return feat.feature === 'follow'
    ? {
        actor_DeltaPoints: P.engagement.follow.followerProfile.points,
        targetEntityCreator_XOR_targetProfile_DeltaPoints:
          feat.entityType === 'profile'
            ? P.engagement.follow.followedProfile.points
            : P.engagement.follow.entityCreatorProfile.points,
        targetEntity_DeltaPopularity: P.engagement.follow.entity.popularity,
      }
    : {
        actor_DeltaPoints: P.curation[feat.feature].toActor.points,
        targetEntityCreator_XOR_targetProfile_DeltaPoints:
          P.curation[feat.feature].toTargetEntityCreator.points,
        targetEntity_DeltaPopularity: P.curation[feat.feature].toTargetEntity.popularity,
      }
}

export function getEntityHandlesByDeltaPointsKey(key: string) {
  const [_entityType, entityKey] = key.split('::')
  assert(_entityType && entityKey)
  const entityType = _entityType as KnownEntityType
  const handle = getEntityCollectionHandle({ entityType })
  const tool = getEntityToolByKnownEntity({ entityType })
  const entityId = getEntityIdByKnownEntity({ entityType, _key: entityKey })
  return { handle, tool, entityId, entityKey, entityType }
}
