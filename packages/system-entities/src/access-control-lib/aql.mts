import type { PkgName } from '@moodlenet/core'
import { entityId, getPkgNamespace } from '../pkg-db-names.mjs'
import type { EntityClass, EntityIdentifier, SomeEntityDataType } from '../types.mjs'

// TODO: export a set of const for known vars for safer AQL construction ? (entity, entityClass, _meta, creator, currentUser)

export function isCreator() {
  return `( entity._meta.creator == currentUser )`
}

export function isCurrentUserEntity() {
  return `( entity._key == currentUser.entityIdentifier._key && entity._meta.entityClass == currentUser.entityIdentifier.entityClass )`
}

export function isEntity(entityIdentifier: EntityIdentifier) {
  const _str_key = toaql(entityIdentifier._key)
  const _str_entityClass = toaql(entityIdentifier.entityClass)
  return `( entity._key == ${_str_key} && entity._meta.entityClass == ${_str_entityClass} )`
}

export function isAuthenticated() {
  return `( currentUser.type != 'anon' )`
}

export function isEntityClass(
  entityClasses: EntityClass<SomeEntityDataType> | EntityClass<SomeEntityDataType>[],
) {
  const isArray = Array.isArray(entityClasses)
  const entityClassesStr = toaql(entityClasses)
  return `( ${entityClassesStr} ${isArray ? 'any ' : ''} == entity._meta.entityClass )`
}

export function entityDocument(entityIdentifier: EntityIdentifier) {
  return `DOCUMENT( "${entityId(entityIdentifier)}" )`
}

export function pkgMetaVar(pkgName: PkgName) {
  return `entity._meta.pkgMeta["${getPkgNamespace(pkgName)}"]`
}

function toaql(any: unknown) {
  return any === void 0 ? 'undefined' : JSON.stringify(any)
}
