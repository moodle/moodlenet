import type { PkgName } from '@moodlenet/core'
import { entityId, getPkgNamespace } from '../pkg-db-names.mjs'
import type {
  AqlVal,
  EntityClass,
  EntityDocument,
  EntityIdentifier,
  SomeEntityDataType,
} from '../types.mjs'

// TODO: export a set of const for known vars for safer AQL construction ? (entity, entityClass, _meta, creator, currentUser)

export function isCreator(): AqlVal<boolean> {
  return `( entity._meta.creator.entityIdentifier == currentUser.entityIdentifier )`
}

export function isCurrentUserEntity(): AqlVal<boolean> {
  return `( entity._key == currentUser.entityIdentifier._key && entity._meta.entityClass == currentUser.entityIdentifier.entityClass )`
}

export function isEntity(entityIdentifier: EntityIdentifier): AqlVal<boolean> {
  const _str_key = toaql(entityIdentifier._key)
  const _str_entityClass = toaql(entityIdentifier.entityClass)
  return `( entity._key == ${_str_key} && entity._meta.entityClass == ${_str_entityClass} )`
}

export function isAuthenticated(): AqlVal<boolean> {
  return `( currentUser.type != 'anon' )`
}

export function isEntityClass(
  entityClasses: EntityClass<SomeEntityDataType> | EntityClass<SomeEntityDataType>[],
): AqlVal<boolean> {
  const isArray = Array.isArray(entityClasses)
  const entityClassesStr = toaql(entityClasses)
  return `( ${entityClassesStr} ${isArray ? 'any ' : ''} == entity._meta.entityClass )`
}

export function entityDocument<T extends SomeEntityDataType>(
  entityIdentifier: EntityIdentifier,
): AqlVal<EntityDocument<T>> {
  return `DOCUMENT( "${entityId(entityIdentifier)}" )`
}

export function creatorEntityDoc<T extends SomeEntityDataType>(): AqlVal<EntityDocument<T>> {
  return `DOCUMENT(entity._meta.creatorEntityId )`
}

export function pkgMetaOf<T>(pkgName: PkgName): AqlVal<T> {
  return `entity._meta.pkgMeta["${getPkgNamespace(pkgName)}"]`
}

export function toaql<T>(any: unknown): AqlVal<T> {
  return any === void 0 ? 'undefined' : JSON.stringify(any)
}
