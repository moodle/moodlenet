// export async function isOwner() {
//   const clientSession = await getCurrentClientSession()
//   const sessionUserKey = clientSession?.user?._key
//   return sessionUserKey ? `(entity._meta.owner == "${sessionUserKey}")` : 'false'

import { PkgName } from '@moodlenet/core'
import { getPkgNamespace } from '../pkg-db-names.mjs'
import { EntityClass, SomeEntityDataType } from '../types.mjs'

// }
export function isOwner() {
  return `( !!clientSession && entity._meta.owner == clientSession.user._key )`
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

export function myPkgMeta(pkgName: PkgName) {
  return `entity._meta.pkgMeta["${getPkgNamespace(pkgName)}"]`
}
