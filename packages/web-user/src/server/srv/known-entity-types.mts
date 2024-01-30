import { Collection, CollectionEntitiesTools } from '@moodlenet/collection/server'
import { EdMetaEntitiesTools, IscedField } from '@moodlenet/ed-meta/server'
import { EdResourceEntitiesTools, Resource } from '@moodlenet/ed-resource/server'
import assert from 'assert'
import type {
  KnownEntityFeature,
  KnownEntityType,
  KnownFeaturedEntities,
} from '../../common/types.mjs'
import { WebUserEntitiesTools } from '../entities.mjs'
import { Profile } from '../exports.mjs'
import type { KnownFeaturedEntityItem } from '../types.mjs'

export type { CollectionDataType } from '@moodlenet/collection/server'
export type { IscedFieldDataType } from '@moodlenet/ed-meta/server'
export type { ResourceDataType } from '@moodlenet/ed-resource/server'

export function getEntityCollectionHandle({ entityType }: { entityType: KnownEntityType }) {
  const handle =
    entityType === 'collection'
      ? Collection
      : entityType === 'resource'
      ? Resource
      : entityType === 'profile'
      ? Profile
      : entityType === 'subject'
      ? IscedField
      : null

  assert(handle)
  return handle
}

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
export function getEntityToolByKnownEntity({ entityType }: { entityType: KnownEntityType }) {
  const _id =
    entityType === 'collection'
      ? CollectionEntitiesTools
      : entityType === 'resource'
      ? EdResourceEntitiesTools
      : entityType === 'profile'
      ? WebUserEntitiesTools
      : entityType === 'subject'
      ? EdMetaEntitiesTools
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
      collection: extractFeaturedIdentifiers('collection', 'bookmark'),
      profile: extractFeaturedIdentifiers('profile', 'bookmark'),
      resource: extractFeaturedIdentifiers('resource', 'bookmark'),
      subject: extractFeaturedIdentifiers('subject', 'bookmark'),
    },
    follow: {
      collection: extractFeaturedIdentifiers('collection', 'follow'),
      profile: extractFeaturedIdentifiers('profile', 'follow'),
      resource: extractFeaturedIdentifiers('resource', 'follow'),
      subject: extractFeaturedIdentifiers('subject', 'follow'),
    },
    like: {
      collection: extractFeaturedIdentifiers('collection', 'like'),
      profile: extractFeaturedIdentifiers('profile', 'like'),
      resource: extractFeaturedIdentifiers('resource', 'like'),
      subject: extractFeaturedIdentifiers('subject', 'like'),
    },
  }
  return myFeaturedEntities

  function extractFeaturedIdentifiers(
    extractEntity: KnownEntityType,
    extractFeature: KnownEntityFeature,
  ): { _key: string }[] {
    return (knownFeaturedEntities ?? [])
      .filter(
        ({ feature, entityType }) => extractFeature === feature && extractEntity === entityType,
      )
      .map(({ _key }) => ({ _key }))
  }
}
