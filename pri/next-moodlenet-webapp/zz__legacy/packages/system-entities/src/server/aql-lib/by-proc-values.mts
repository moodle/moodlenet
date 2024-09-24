import type { PkgName } from '@moodlenet/core'
import { entityIdByIdentifier, getPkgNamespace } from '../../common/entity-identification.mjs'
import type { EntityClass, EntityIdentifier, SomeEntityDataType } from '../../common/types.mjs'
import type { AqlVal, EntityDocument } from '../types.mjs'
import { currentEntityKey, currentEntityMeta, toaql } from './aql.mjs'

export function isCurrentThisEntity(entityIdentifier: EntityIdentifier): AqlVal<boolean> {
  const _str_key = toaql(entityIdentifier._key)
  const _str_entityClass = toaql(entityIdentifier.entityClass)
  return `( ${currentEntityKey} == ${_str_key} && ${currentEntityMeta}.entityClass == ${_str_entityClass} )`
}
export function isCurrentOfEntityClass2Aql(
  entityClasses: EntityClass<SomeEntityDataType> | EntityClass<SomeEntityDataType>[],
): AqlVal<boolean> {
  const isArray = Array.isArray(entityClasses)
  const entityClassesStr = toaql(entityClasses)
  return `( ${entityClassesStr} ${isArray ? 'any ' : ''} == ${currentEntityMeta}.entityClass )`
}

export function entityDocument2Aql<T extends SomeEntityDataType>(
  entityIdentifier: EntityIdentifier,
): AqlVal<EntityDocument<T>> {
  return `DOCUMENT( "${entityIdByIdentifier(entityIdentifier)}" )`
}

export function pkgMetaOf2Aql<T>(pkgName: PkgName): AqlVal<T> {
  return `${currentEntityMeta}.pkgMeta["${getPkgNamespace(pkgName)}"]`
}
