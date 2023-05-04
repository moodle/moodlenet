import type { PkgName } from '@moodlenet/core'
import * as pkgDbNames from '../pkg-db-names.mjs'
import type {
  AqlVal,
  EntityClass,
  EntityDocument,
  EntityIdentifier,
  SomeEntityDataType,
} from '../types.mjs'
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
  return `DOCUMENT( "${pkgDbNames.entityId(entityIdentifier)}" )`
}

export function pkgMetaOf2Aql<T>(pkgName: PkgName): AqlVal<T> {
  return `${currentEntityMeta}.pkgMeta["${pkgDbNames.getPkgNamespace(pkgName)}"]`
}
