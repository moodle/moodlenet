import type { PkgName } from '@moodlenet/core'
import assert from 'assert'
import { getEntityFullTypename } from '../common/entity-identification.mjs'
import type { EntityClass, SomeEntityDataType } from '../common/types.mjs'
import { db } from './init.mjs'
import type { AqlVal, EntityDocFullData } from './types.mjs'

export async function getEntityCollection<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
) {
  const entityCollection = db.collection<EntityDocFullData<EntityDataType>>(
    getEntityFullTypename(entityClass),
  )
  assert(await entityCollection.exists())
  return entityCollection
}

export function aqlGetPkgNamespace(pkgNameVal: AqlVal<PkgName>) {
  return `SUBSTITUTE( REGEX_REPLACE( ${pkgNameVal}, '^@', '' ), '/', '__', 1 )`
}
