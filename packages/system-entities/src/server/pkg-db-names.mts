import type { PkgName } from '@moodlenet/core'
import assert from 'assert'
import { db } from './init.mjs'
import type {
  AqlVal,
  EntityClass,
  EntityDocFullData,
  EntityIdentifier,
  SomeEntityDataType,
} from './types.mjs'

export function getEntityCollectionName(entityClass: EntityClass<any>) {
  return `${getPkgNamespace(entityClass.pkgName)}__${entityClass.type}`
}

export async function getEntityCollection<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
) {
  const entityCollection = db.collection<EntityDocFullData<EntityDataType>>(
    getEntityCollectionName(entityClass),
  )
  assert(await entityCollection.exists())
  return entityCollection
}

export function getPkgNamespace(pkgName: PkgName) {
  return `${pkgName.replace(/^@/, '').replace('/', '__')}`
}

export function aqlGetPkgNamespace(pkgNameVal: AqlVal<PkgName>) {
  return `SUBSTITUTE( REGEX_REPLACE( ${pkgNameVal}, '^@', '' ), '/', '__', 1 )`
}

export function entityId(entityIdentifier: EntityIdentifier) {
  const collectionName = getEntityCollectionName(entityIdentifier.entityClass)
  return `${collectionName}/${entityIdentifier._key}`
}
