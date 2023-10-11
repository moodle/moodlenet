import { CollectionEntitiesTools } from '@moodlenet/collection/server'
import { EdMetaEntitiesTools } from '@moodlenet/ed-meta/server'
import { EdResourceEntitiesTools } from '@moodlenet/ed-resource/server'
import assert from 'assert'
import type {
  KnownEntityFeature,
  KnownEntityType,
  KnownFeaturedEntities,
} from '../../common/types.mjs'
import { WebUserEntitiesTools } from '../entities.mjs'
import type { KnownFeaturedEntityItem } from '../types.mjs'

export function getEntityIdByKnownEntity({
  entityType,
  _key,
}: {
  _key: string
  entityType: KnownEntityType
}) {
  const _id =
    entityType === 'collection'
      ? CollectionEntitiesTools.getIdentifiersByKey({ _key, type: 'Collection' })._id
      : entityType === 'resource'
      ? EdResourceEntitiesTools.getIdentifiersByKey({ _key, type: 'Resource' })._id
      : entityType === 'profile'
      ? WebUserEntitiesTools.getIdentifiersByKey({ _key, type: 'Profile' })._id
      : entityType === 'subject'
      ? EdMetaEntitiesTools.getIdentifiersByKey({ _key, type: 'IscedField' })._id
      : null

  assert(_id)
  return _id
}

export function isAllowedKnownEntityFeature({
  entityType,
  feature,
}: {
  feature: KnownEntityFeature
  entityType: KnownEntityType
}) {
  const allowedFeature: { [feat in KnownEntityFeature]: KnownEntityType[] } = {
    bookmark: ['collection', 'resource'],
    follow: ['collection', 'profile', 'subject'],
    like: ['resource'],
  }
  return allowedFeature[feature].find(allowedType => allowedType === entityType)
}

export function reduceToKnownFeaturedEntities(
  knownFeaturedEntities: KnownFeaturedEntityItem[],
): KnownFeaturedEntities {
  const myFeaturedEntities: KnownFeaturedEntities = {
    bookmark: {
      collection: extractFeaturedIdentifiers('Collection', 'bookmark'),
      profile: extractFeaturedIdentifiers('Profile', 'bookmark'),
      resource: extractFeaturedIdentifiers('Resource', 'bookmark'),
      subject: extractFeaturedIdentifiers('Subject', 'bookmark'),
    },
    follow: {
      collection: extractFeaturedIdentifiers('Collection', 'follow'),
      profile: extractFeaturedIdentifiers('Profile', 'follow'),
      resource: extractFeaturedIdentifiers('Resource', 'follow'),
      subject: extractFeaturedIdentifiers('Subject', 'follow'),
    },
    like: {
      collection: extractFeaturedIdentifiers('Collection', 'like'),
      profile: extractFeaturedIdentifiers('Profile', 'like'),
      resource: extractFeaturedIdentifiers('Resource', 'like'),
      subject: extractFeaturedIdentifiers('Subject', 'like'),
    },
  }
  return myFeaturedEntities

  function extractFeaturedIdentifiers(
    extractEntity: Capitalize<KnownEntityType>,
    extractFeature: KnownEntityFeature,
  ): { _key: string }[] {
    const filteredByFeature = (knownFeaturedEntities ?? []).filter(
      ({ feature }) => extractFeature === feature,
    )
    const identifiers =
      extractEntity === 'Collection'
        ? CollectionEntitiesTools.mapToIdentifiersFilterType({
            ids: filteredByFeature,
            type: extractEntity,
          })
        : extractEntity === 'Resource'
        ? EdResourceEntitiesTools.mapToIdentifiersFilterType({
            ids: filteredByFeature,
            type: extractEntity,
          })
        : extractEntity === 'Subject'
        ? EdMetaEntitiesTools.mapToIdentifiersFilterType({
            ids: filteredByFeature,
            type: 'IscedField',
          })
        : extractEntity === 'Profile'
        ? WebUserEntitiesTools.mapToIdentifiersFilterType({
            ids: filteredByFeature,
            type: extractEntity,
          })
        : []

    return identifiers.map(({ entityIdentifier: { _key } }) => ({ _key }))
  }
}
