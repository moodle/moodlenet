import { PkgName } from '@moodlenet/core'
import assert from 'assert'
import { db } from './init.mjs'
import { EntityClass, EntityData, EntityIdentifier, SomeEntityDataType } from './types.mjs'

export function getEntityCollectionName(entityClass: EntityClass<any>) {
  return `${getPkgNamespace(entityClass.pkgName)}__${entityClass.type}`
}

export async function getEntityCollection<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
) {
  const entityCollection = db.collection<EntityData<EntityDataType>>(
    getEntityCollectionName(entityClass),
  )
  assert(await entityCollection.exists())
  return entityCollection
}

export function getPkgNamespace(pkgName: PkgName) {
  return `${pkgName.replace(/^@/, '').replace('/', '__')}`
}

export function entityId(entityIdentifier: EntityIdentifier) {
  const collectionName = getEntityCollectionName(entityIdentifier.entityClass)
  return `${collectionName}/${entityIdentifier._key}`
}
