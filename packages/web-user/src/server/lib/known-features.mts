import { CollectionEntitiesTools } from '@moodlenet/collection/server'
import { EdResourceEntitiesTools } from '@moodlenet/ed-resource/server'
import assert from 'assert'
import type { KnownEntityType } from '../../common/types.mjs'
import { WebUserEntitiesTools } from '../entities.mjs'

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
      : null

  assert(_id)
  return _id
}
