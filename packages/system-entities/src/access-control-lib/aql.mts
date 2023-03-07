import type { PkgName } from '@moodlenet/core'
import { getPkgNamespace } from '../pkg-db-names.mjs'
import type { EntityClass, SomeEntityDataType } from '../types.mjs'

// TODO: export a set of const for known vars for safer AQL construction ? (entity, entityClass, _meta, creator, clientSession)

export function isCreator() {
  return `( !!clientSession && entity._meta.creator == clientSession.user._key )`
}

export function isAuthenticated() {
  return `( !!clientSession )`
}

export function isEntityClass(
  entityClasses: EntityClass<SomeEntityDataType> | EntityClass<SomeEntityDataType>[],
) {
  const isArray = Array.isArray(entityClasses)
  const entityClassesStr = JSON.stringify(entityClasses)
  return `( ${entityClassesStr} ${isArray ? 'any ' : ''}== entity._meta.entityClass )`
}

export function pkgMetaVar(pkgName: PkgName) {
  return `entity._meta.pkgMeta["${getPkgNamespace(pkgName)}"]`
}
