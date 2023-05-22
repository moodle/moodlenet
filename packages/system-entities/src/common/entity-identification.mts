import type { PkgName } from '@moodlenet/core'
import assert from 'assert'
import type { EntityClass, EntityIdentifier, EntityIdentifiers } from './types.mjs'

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
  const pkgName = hasPkgNamespace ? `@${pkgNamespace}/${basePkgName}` : basePkgName
  const entityIdentifier: EntityIdentifier = {
    _key,
    entityClass: {
      pkgName,
      type,
    },
  }
  return entityIdentifier
}

export function getEntityIdentifiers(id: string | EntityIdentifier): EntityIdentifiers {
  const gotStringId = typeof id === 'string'
  const entityIdentifier = gotStringId ? entityIdentifierById(id) : id
  const _id = gotStringId ? id : entityIdByIdentifier(id)
  return { _id, entityIdentifier }
}

export function getEntityIdentifiersByKey<EntityTypeName extends string>({
  _key,
  type,
  pkgName,
}: {
  _key: string
  type: EntityTypeName
  pkgName: string
}) {
  const entityIdentifier: EntityIdentifier = {
    _key,
    entityClass: {
      pkgName,
      type,
    },
  }
  return getEntityIdentifiers(entityIdentifier)
}

export function getEntityIdentifiersById<EnsureEntityClass extends EntityClass<any>>({
  _id,
  ensureClass,
}: {
  _id: string
  ensureClass?: EnsureEntityClass
}) {
  const identifiers = getEntityIdentifiers(_id)
  if (ensureClass && !isOfSameClass(ensureClass, identifiers.entityIdentifier.entityClass)) {
    return undefined
  }
  return identifiers
}

export function getEntityIdentifiersByIdAssertClass<EnsureEntityClass extends EntityClass<any>>({
  _id,
  ensureClass,
}: {
  _id: string
  ensureClass: EnsureEntityClass
}) {
  const identifiers = getEntityIdentifiersById({ _id, ensureClass })
  assert(identifiers)
  return identifiers
}

export function isOfSameClass(cl1: EntityClass<any>, cl2: EntityClass<any>) {
  return cl1.pkgName == cl2.pkgName && cl1.type == cl2.type
}
