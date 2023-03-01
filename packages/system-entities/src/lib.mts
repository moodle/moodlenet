import { ensureDocumentCollection } from '@moodlenet/arangodb/server'
import { getCurrentClientSession } from '@moodlenet/authentication-manager/server'
import type { PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import { db } from './init.mjs'
import { shell } from './shell.mjs'
import {
  AccessController,
  ByKeyOrId,
  ControllerDeny,
  EntityClass,
  EntityCollectionDef,
  EntityCollectionDefOpts,
  EntityCollectionDefs,
  EntityCollectionHandle,
  EntityCollectionHandles,
  EntityData,
  EntityDocument,
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
  const namesAndHandles = await Promise.all(
    Object.entries(entities).map(([entityName, defOpt]) =>
      registerEntity(entityName, defOpt).then(handle => ({ entityName, handle })),
    ),
  )

  const handles = namesAndHandles.reduce(
    (_acc, { entityName, handle }) => ({
      ..._acc,
      [entityName]: handle,
    }),
    {} as EntityCollectionHandles<Defs>,
  )

  return handles
}

type AccessControllerRegistry = AccessControllerRegistryItem[]
type AccessControllerRegistryItem = {
  controller: Partial<AccessController>
  pkgId: PkgIdentifier
}
const accessControllerRegistry: AccessControllerRegistry = []
export async function registerAccessController(controller: Partial<AccessController>) {
  const { pkgId } = shell.assertCallInitiator()
  accessControllerRegistry.push({
    controller,
    pkgId,
  })
}

export async function registerEntity<DataType extends Record<string, any>>(
  entityName: string,
  _defOpt?: EntityCollectionDefOpts,
): Promise<EntityCollectionHandle<EntityCollectionDef<DataType>>> {
  type Def = EntityCollectionDef<DataType>
  const { pkgId } = shell.assertCallInitiator()

  const entityClass: EntityClass = {
    pkgName: pkgId.name,
    type: entityName,
  }

  const entityCollectionName = getEntityCollectionName(pkgId, entityName)
  const { collection /* , newlyCreated */ } = await shell.call(ensureDocumentCollection)<
    EntityData<DataType>
  >(entityCollectionName)

  const create: EntityCollectionHandle<Def>['create'] = async newEntityData => {
    const clientSession = await getCurrentClientSession()
    const controllerDenies = clientSession?.isRoot
      ? []
      : (
          await Promise.all(
            accessControllerRegistry.map(({ controller, pkgId }) => {
              return Promise.resolve(controller.create?.(entityClass))
                .then(() => undefined)
                .catch(error => {
                  const controllerDeny: ControllerDeny = { pkgId, error }
                  return controllerDeny
                })
            }),
          )
        ).filter(notUndefined)
    if (controllerDenies.length) {
      return {
        accessControl: false,
        controllerDenies,
      }
    }

    const userKey = (await getCurrentClientSession())?.user?._key

    const now = new Date().toISOString()

    const { new: newEntity } = await collection.save(
      {
        ...newEntityData,
        _meta: {
          owner: userKey,
          updated: now,
          created: now,
          entityClass,
          pkgMeta: {},
        },
      },
      { returnNew: true },
    )
    assert(newEntity)
    return { newEntity, accessControl: true }
  }

  const patch: EntityCollectionHandle<Def>['patch'] = async (byKeyOrId, patchEntityData) => {
    const key = getKey(byKeyOrId)
    // const entity = await get(sel)
    // if (!entity) {
    //   return null
    // }
    const clientSession = await getCurrentClientSession()

    const controllers = clientSession?.isRoot
      ? []
      : (
          await Promise.all(
            accessControllerRegistry.map(({ controller /* , pkgId */ }) => controller.update?.()),
          )
        ).filter(notUndefined)
    const q = `
LET clientSession = @clientSession
FOR entity in @@collection
FILTER entity._key == @key && ${controllers.map(_ => `(${_})`).join(' && ')}
LIMIT 1
UPDATE entity WITH @entityPatch IN @@collection
return {NEW, OLD}
`
    const entityPatch = {
      ...patchEntityData,
      _meta: {
        updated: new Date().toISOString(),
      },
    }
    const bindVars = { '@collection': collection.name, entityPatch, key, clientSession }
    // console.log(q, bindVars)
    const updateResponseCursor = await db.query<{
      NEW: EntityDocument<DataType>
      OLD: EntityDocument<DataType>
    }>(q, bindVars)

    const updateResponse = (await updateResponseCursor.all())[0]
    // console.log({ updateResponse })

    if (!updateResponse) {
      return null
    }
    const { NEW: newEntityData, OLD: oldEntityData } = updateResponse
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
  const is: EntityCollectionHandle<Def>['is'] = (doc): doc is any => {
    return (
      doc._meta.entityClass.pkgName === entityClass.pkgName &&
      doc._meta.entityClass.type === entityClass.type
    )
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
    is,
  }
}

function notUndefined<T>(_: T | undefined): _ is T {
  return _ !== undefined
}

function getKey(ByKeyOrId: ByKeyOrId) {
  if ('_key' in ByKeyOrId) {
    return ByKeyOrId._key
  } else {
    const _key = ByKeyOrId._id.split('/')[0]
    assert(_key)
    return _key
  }
}
