import { ensureDocumentCollection, Patch } from '@moodlenet/arangodb/server'
import { getCurrentClientSession, ROOT_USER_KEY } from '@moodlenet/authentication-manager/server'
import type { PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import { inspect } from 'util'
import { myPkgMeta } from './access-control-lib/aql.mjs'
import { db } from './init.mjs'
import { getEntityCollection, getEntityCollectionName } from './pkg-db-names.mjs'
import { shell } from './shell.mjs'
import {
  AccessControllers,
  ByKeyOrId,
  EntityClass,
  EntityCollectionDef,
  EntityCollectionDefOpts,
  EntityCollectionDefs,
  EntityCollectionHandle,
  EntityCollectionHandles,
  EntityData,
  EntityDocument,
  SomeEntityDataType,
} from './types.mjs'

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
  accessControllers: Partial<AccessControllers>
  pkgId: PkgIdentifier
}
const accessControllerRegistry: AccessControllerRegistry = []
export async function registerAccessController(accessControllers: Partial<AccessControllers>) {
  const { pkgId } = shell.assertCallInitiator()
  accessControllerRegistry.push({
    accessControllers,
    pkgId,
  })
}

export async function registerEntity<EntityDataType extends SomeEntityDataType>(
  entityName: string,
  _defOpt?: EntityCollectionDefOpts,
): Promise<EntityCollectionHandle<EntityCollectionDef<EntityDataType>>> {
  const { pkgId } = shell.assertCallInitiator()

  const entityClass: EntityClass<EntityDataType> = {
    pkgName: pkgId.name,
    type: entityName,
  }

  const entityCollectionName = getEntityCollectionName(entityClass)
  const { collection /* , newlyCreated */ } = await shell.call(ensureDocumentCollection)<
    EntityData<EntityDataType>
  >(entityCollectionName)

  return {
    collection,
    entityClass,
  }
}
export async function canCreateEntity(entityClass: EntityClass<SomeEntityDataType>) {
  const clientSession = await getCurrentClientSession()

  if (clientSession?.isRoot) {
    return true
  }

  const controllerResults = (
    await Promise.all(
      accessControllerRegistry.map(async ({ accessControllers: controller /* , pkgId  */ }) =>
        controller.c?.(entityClass),
      ),
    )
  ).filter(neitherUndefinedOrNull)

  const canCreate = !controllerResults.includes(false) && controllerResults.includes(true)
  return canCreate
}

export async function create<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  newEntityData: EntityDataType,
) {
  const clientSession = await getCurrentClientSession()
  if (!clientSession) {
    return {
      accessControl: false,
    } as const
  }

  const canCreate = await canCreateEntity(entityClass)
  if (!canCreate) {
    return {
      accessControl: false,
    } as const
  }

  const userKey = clientSession.isRoot ? ROOT_USER_KEY : clientSession.user._key

  const now = new Date().toISOString()

  const collection = await getEntityCollection(entityClass)
  const { new: newEntity } = await collection.save(
    {
      ...newEntityData,
      _meta: {
        creator: userKey,
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
  return { newEntity, accessControl: true } as const
}

export async function patch<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  byKeyOrId: ByKeyOrId,
  entityDataPatch: Patch<EntityDataType>,
) {
  const entityAccess = await getEntityAccess(entityClass, byKeyOrId)
  if (!entityAccess) {
    return
  }
  if (!entityAccess.access.u.can) {
    return
  }
  const entityPatch = {
    ...entityDataPatch,
    _meta: {
      updated: new Date().toISOString(),
    },
  }

  const collection = await getEntityCollection(entityClass)

  const { new: newEntityData, old: oldEntityData } = await collection.update(
    byKeyOrId,
    entityPatch,
    { mergeObjects: true, returnNew: true, returnOld: true },
  )

  assert(newEntityData && oldEntityData)
  return { new: newEntityData, old: oldEntityData }
}

export async function del<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  byKeyOrId: ByKeyOrId,
) {
  const key = getKey(byKeyOrId)
  const collectionName = getEntityCollectionName(entityClass)
  const delCursor = await queryEntities<EntityDataType>(
    entityClass,
    `FILTER entity._key == "${key}" 
    LIMIT 1`,
    {
      opBody: `FILTER access.d.can 
                REMOVE entity IN ${collectionName}`,
    },
  )
  const deletedEntity = (await delCursor.all())[0]?.entity
  return deletedEntity
}

export async function get<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  byKeyOrId: ByKeyOrId,
) {
  const entityAccess = await getEntityAccess(entityClass, byKeyOrId)
  return entityAccess?.entity
}

export async function getEntityAccess<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  byKeyOrId: ByKeyOrId,
) {
  const key = getKey(byKeyOrId)
  const cursor = await queryEntities<EntityDataType>(
    entityClass,
    `FILTER entity._key == "${key}" LIMIT 1`,
  )
  const get_findResult = (await cursor.all())[0]
  console.log(inspect({ get_findResult }, false, 10, true))
  return get_findResult
}

export async function queryEntities<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  queryBody: string,
  opts?: Partial<{ opBody: string; noFilterRead: boolean }>,
) {
  const entityCollectionName = getEntityCollectionName(entityClass)
  const clientSession = await getCurrentClientSession()
  const { aqlAccessControlsObjString } = await getAQLAccessControlObjectDefString(
    clientSession?.isRoot,
  )

  const q = `
    LET clientSession = @clientSession
    FOR entity in @@collection
    ${queryBody}
    LET accessControls = ${aqlAccessControlsObjString}
    LET access = {
      r: { 
        can: (accessControls.r NONE == false) && (accessControls.r ANY == true) 
      },
      u:  { 
        can: (accessControls.u NONE == false) && (accessControls.u ANY == true) 
      },
      d:  { 
        can: (accessControls.d NONE == false) && (accessControls.d ANY == true) 
      }
    }
    ${opts?.noFilterRead === true ? '' : 'FILTER access.r.can'}
    ${opts?.opBody ?? '// NOOP'}

    return { 
      entity,
      access
    }
`

  const bindVars = { '@collection': entityCollectionName, clientSession }
  console.log(q, bindVars)
  const updateResponseCursor = await db.query<{
    entity: EntityDocument<EntityDataType>
    access: {
      r: { can: boolean }
      u: { can: boolean }
      d: { can: boolean }
    }
  }>(q, bindVars)
  return updateResponseCursor
}

export function docIsOfClass<EntityDataType extends SomeEntityDataType>(
  doc: EntityDocument<any>,
  entityClass: EntityClass<EntityDataType>,
): doc is EntityDocument<EntityDataType> {
  return isSameClass(entityClass, doc._meta.entityClass)
}

export function isSameClass<EntityDataType extends SomeEntityDataType>(
  class1: EntityClass<EntityDataType>,
  class2: EntityClass<any>,
): class2 is EntityClass<EntityDataType> {
  return class1.pkgName === class2.pkgName && class1.type === class2.type
}

function neitherUndefinedOrNull<T>(_: T | undefined | null): _ is T {
  return _ !== undefined && _ !== null
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

async function getAQLAccessControlObjectDefString(rootAccess = false) {
  if (rootAccess) {
    return {
      aqlAccessControlsObjString: `{
        r: [ true ] /* ROOT ACCESS */,
        u: [ true ] /* ROOT ACCESS */,
        d: [ true ] /* ROOT ACCESS */,
      }`,
    }
  }

  const [r, w, d] = await Promise.all([
    getAqlOperationAccessControlArrayElemsString('r'),
    getAqlOperationAccessControlArrayElemsString('u'),
    getAqlOperationAccessControlArrayElemsString('d'),
  ])

  const aqlAccessControlsObjString = `{
        r: [ ${r.aql} ],
        u: [ ${w.aql} ],
        d: [ ${d.aql} ],
      }`
  return { aqlAccessControlsObjString }
}

async function getAqlOperationAccessControlArrayElemsString(op: 'r' | 'u' | 'd') {
  const operationAccessControlResponses = await Promise.all(
    accessControllerRegistry.map(({ accessControllers, pkgId }) =>
      accessControllers[op]?.({ myPkgMeta: myPkgMeta(pkgId.name) }),
    ),
  )

  const aql = operationAccessControlResponses
    .filter(neitherUndefinedOrNull)
    .map(acElem => `(${acElem})`)
    .join(',\n')

  return {
    aql,
  }
}
