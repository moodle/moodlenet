import { ensureDocumentCollection, Patch } from '@moodlenet/arangodb/server'
import { PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import { inspect } from 'util'
import { pkgMetaVar } from './access-control-lib/aql.mjs'
import { db, env } from './init.mjs'
import { getEntityCollection, getEntityCollectionName } from './pkg-db-names.mjs'
import { shell } from './shell.mjs'
import {
  AccessControllers,
  AnonUser,
  ByKeyOrId,
  EntityClass,
  EntityCollectionDef,
  EntityCollectionDefOpts,
  EntityCollectionDefs,
  EntityCollectionHandle,
  EntityCollectionHandles,
  EntityData,
  EntityDocument,
  PkgUser,
  RootUser,
  SomeEntityDataType,
  SystemUser,
} from './types.mjs'
import { CurrentUserFetchedCtx, FetchCurrentUser } from './types.private.mjs'

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
  const currentUser = await getCurrentSystemUser()

  if (currentUser.type === 'root') {
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
  const currentUser = await getCurrentSystemUser()

  const canCreate = await canCreateEntity(entityClass)
  if (!canCreate) {
    return {
      accessControl: false,
    } as const
  }

  const now = new Date().toISOString()

  const collection = await getEntityCollection(entityClass)
  const { new: newEntity } = await collection.save(
    {
      ...newEntityData,
      _meta: {
        creator: currentUser,
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
  const currentUser = await getCurrentSystemUser()
  const { aqlAccessControlsObjString } = await getAQLAccessControlObjectDefString(currentUser)

  const q = `
    LET currentUser = @currentUser
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

  const bindVars = { '@collection': entityCollectionName, currentUser }
  console.log(q, inspect({ currentUser }, false, 10, true))
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
  target: EntityClass<EntityDataType>,
  someClass: EntityClass<SomeEntityDataType>,
): someClass is EntityClass<EntityDataType> {
  return target.pkgName === someClass.pkgName && target.type === someClass.type
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

export function includesSameClass(
  target: EntityClass<SomeEntityDataType>,
  someClasses: EntityClass<SomeEntityDataType>[],
) {
  return someClasses.map(someClass => isSameClass(target, someClass)).includes(true)
}

export function includesAnySameClass(
  targets: EntityClass<SomeEntityDataType>[],
  someClasses: EntityClass<SomeEntityDataType>[],
) {
  return targets.map(target => includesSameClass(target, someClasses)).includes(true)
}

// export function matchEntityClass(
//   target: EntityClass<SomeEntityDataType>,
//   someClasses: EntityClass<SomeEntityDataType>[],
//   falseOnEmptyStack?: boolean,
// ) {
//   if (!falseOnEmptyStack && !someClasses.length) {
//     return true
//   }
//   return someClasses.map(someClass => isSameClass(target, someClass)).includes(true)
// }

// export function matchAnySameClass(
//   targets: EntityClass<SomeEntityDataType>[],
//   someClasses: EntityClass<SomeEntityDataType>[],
//   falseOnEmptyStack?: boolean,
// ) {
//   if (!falseOnEmptyStack && !someClasses.length) {
//     return true
//   }
//   return targets.map(target => includesSameClass(target, someClasses)).includes(true)
// }

async function getAQLAccessControlObjectDefString(systemUser: SystemUser) {
  if (systemUser.type === 'root') {
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
      accessControllers[op]?.({ myPkgMeta: pkgMetaVar(pkgId.name) }),
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

export async function setCurrentUserFetch(fetchCurrentUser: FetchCurrentUser) {
  shell.myAsyncCtx.set(() => ({
    type: 'CurrentUserNotFetchedCtx',
    fetchCurrentUser,
  }))
}

export const ANON_SYSTEM_USER: AnonUser = { type: 'anon' }
export const ROOT_SYSTEM_USER: RootUser = { type: 'root' }

export async function getCurrentSystemUser() {
  const currentCtx = shell.myAsyncCtx.get()
  if (!currentCtx) {
    return ANON_SYSTEM_USER
  }
  if (currentCtx.type === 'CurrentUserFetchedCtx') {
    return currentCtx.currentUser
  }
  const currentUser = await currentCtx.fetchCurrentUser()
  if (!currentUser) {
    return ANON_SYSTEM_USER
  }
  const currentUserFetchedCtx: CurrentUserFetchedCtx = {
    type: 'CurrentUserFetchedCtx',
    currentUser,
  }
  shell.myAsyncCtx.set(() => currentUserFetchedCtx)
  return currentUser
}

export async function matchRootPassword(matchPassword: string): Promise<boolean> {
  if (!(env.rootPassword && matchPassword)) {
    return false
  }
  return env.rootPassword === matchPassword
}

export async function setPkgCurrentUser() {
  const { pkgId } = shell.assertCallInitiator()
  const currentPkgUser: PkgUser = {
    type: 'pkg',
    pkgName: pkgId.name,
  }
  shell.myAsyncCtx.set(() => ({ type: 'CurrentUserFetchedCtx', currentUser: currentPkgUser }))
}
