import type { PkgName } from '@moodlenet/core'
import assert from 'assert'
import type { EntityClass, EntityIdentifier } from './types.mjs'

export function getEntityFullTypename(entityClass: EntityClass<any>) {
  return `${getPkgNamespace(entityClass.pkgName)}__${entityClass.type}`
}
export function getPkgNamespace(pkgName: PkgName) {
  return `${pkgName.replace(/^@/, '').replace('/', '__')}`
}
export function entityIdByIdentifier(entityIdentifier: EntityIdentifier) {
  const entityFullTypename = getEntityFullTypename(entityIdentifier.entityClass)
  return `${entityFullTypename}/${entityIdentifier._key}`
}

export function entityIdentifierById(_id: string) {
  const [fullName, _key] = _id.split('/')
  assert(fullName && _key)
  const [type, basePkgName, pkgNamespace] = fullName.split('__').reverse()
  assert(type && basePkgName)
  const hasPkgNamespace = !!pkgNamespace
  const pkgName = hasPkgNamespace ? `${pkgNamespace}/${basePkgName}` : basePkgName
  const entityIdentifier: EntityIdentifier = {
    _key,
    entityClass: {
      pkgName,
      type,
    },
  }
  return entityIdentifier
}

export function getIdAndEntityIdentifier(id: string | EntityIdentifier) {
  const gotStringId = typeof id === 'string'
  const entityIdentifier = gotStringId ? entityIdentifierById(id) : id
  const _id = gotStringId ? id : entityIdByIdentifier(id)
  return { _id, entityIdentifier }
}
