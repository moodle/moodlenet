import { ensureDocumentCollection } from '@moodlenet/arangodb/server'
import { getCurrentClientSession } from '@moodlenet/authentication-manager/server'
import type { PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import { shell } from './shell.mjs'
import {
  EntityCollectionDef,
  EntityCollectionDefOpts,
  EntityCollectionDefs,
  EntityCollectionHandle,
  EntityCollectionHandles,
  EntityData,
} from './types.mjs'

export function getEntityCollectionName(pkgId: PkgIdentifier, entityName: string) {
  return `${getPkgNamespace(pkgId)}__${entityName}`
}

export function getPkgNamespace(pkgId: PkgIdentifier) {
  return `${pkgId.name.replace(/^@/, '').replace('/', '__')}`
}

export async function registerEntities<Defs extends EntityCollectionDefs>(entities: {
  [name in keyof Defs]: EntityCollectionDefOpts
}): Promise<EntityCollectionHandles<Defs>> {
  const handles = await Object.keys(entities).reduce(async (_acc, entityName) => {
    const defOpt = entities[entityName]
    assert(defOpt)
    return {
      ...(await _acc),
      [entityName]: await registerEntity(entityName, defOpt),
    }
  }, Promise.resolve({} as EntityCollectionHandles<Defs>))
  return handles
}

export async function registerEntity<DataType extends Record<string, any>>(
  entityName: string,
  _defOpt?: EntityCollectionDefOpts,
): Promise<EntityCollectionHandle<EntityCollectionDef<DataType>>> {
  type Def = EntityCollectionDef<DataType>
  const { pkgId } = shell.assertCallInitiator()
  const entityCollectionName = getEntityCollectionName(pkgId, entityName)
  const { collection /* , newlyCreated */ } = await shell.call(ensureDocumentCollection)<
    EntityData<DataType>
  >(entityCollectionName)
  const create: EntityCollectionHandle<Def>['create'] = async newEntityData => {
    const userKey = (await getCurrentClientSession())?.user?._key

    const now = new Date().toISOString()

    const { new: newEntity } = await collection.save(
      {
        ...newEntityData,
        _meta: {
          owner: userKey,
          updated: now,
          created: now,
          entityClass: { pkgName: pkgId.name, type: entityName },
          pkgMeta: {},
        },
      },
      { returnNew: true },
    )
    assert(newEntity)
    return newEntity
  }

  const patch: EntityCollectionHandle<Def>['patch'] = async (sel, patchEntityData) => {
    const updateResponse = await collection.update(
      sel,
      {
        ...patchEntityData,
        _meta: {
          updated: new Date().toISOString(),
        },
      },
      { returnNew: true, returnOld: true, mergeObjects: true },
    )
    if (!updateResponse) {
      return null
    }
    const { new: newEntityData, old: oldEntityData } = updateResponse
    assert(newEntityData && oldEntityData)
    return { new: newEntityData, old: oldEntityData }
  }

  const remove: EntityCollectionHandle<Def>['remove'] = async sel => {
    const { old } = await collection.remove(sel, { returnOld: true })
    if (!old) {
      return null
    }
    return old
  }
  const get: EntityCollectionHandle<Def>['get'] = async sel => {
    const entity = await collection.document(sel, true)
    if (!entity) {
      return null
    }
    return entity
  }

  return {
    collection,
    create,
    patch,
    get,
    remove,
  }
}
