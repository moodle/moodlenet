import { ensureDocumentCollection, Patch } from '@moodlenet/arangodb/server'
import { PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import { inspect } from 'util'
import { entityDocument, pkgMetaOf } from './access-control-lib/aql.mjs'
import { db, env } from './init.mjs'
import { entityId, getEntityCollection, getEntityCollectionName } from './pkg-db-names.mjs'
import { shell } from './shell.mjs'
import {
  AccessControllers,
  AnonUser,
  AqlVal,
  EntityAccess,
  EntityClass,
  EntityCollectionDef,
  EntityCollectionDefOpts,
  EntityCollectionDefs,
  EntityCollectionHandle,
  EntityCollectionHandles,
  EntityDocFullData,
  EntityDocument,
  EntityMetadata,
  PkgUser,
  ProjectRes,
  ProjectVal,
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
    EntityDocFullData<EntityDataType>
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
    return
  }

  const now = new Date().toISOString()

  const collection = await getEntityCollection(entityClass)
  const { new: newEntity } = await collection.save(
    {
      ...newEntityData,
      _meta: {
        creator: currentUser,
        creatorEntityId:
          currentUser.type === 'entity' ? entityId(currentUser.entityIdentifier) : undefined,
        updated: now,
        created: now,
        entityClass,
        pkgMeta: {},
      },
    },
    { returnNew: true },
  )
  assert(newEntity)
  return newEntity
}

export async function patchEntity<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  key: string,
  entityDataPatch: Patch<EntityDataType>,
  opts?: {
    projectAccess?: EntityAccess[]
  },
) {
  const patchCursor = await queryEntities(entityClass, 'u', {
    preAccessBody: `FILTER entity._key == @key LIMIT 1`,
    postAccessBody: `UPDATE entity WITH UNSET(@entityDataPatch, '_meta') IN @@collection`,
    bindVars: { key, entityDataPatch },
    project: { patched: 'NEW' as AqlVal<EntityDocument<EntityDataType>> },
    projectAccess: opts?.projectAccess,
  })
  const patchRecord = await patchCursor.next()
  return patchRecord
}

export async function delEntity<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  key: string,
) {
  const delCursor = await queryEntities(entityClass, 'd', {
    bindVars: { key },
    preAccessBody: `FILTER entity._key == @key LIMIT 1`,
    postAccessBody: `REMOVE entity IN @@collection`,
  })
  const deleteRecord = await delCursor.next()
  return deleteRecord
}

type GetEntityOpts<Project extends ProjectVal<any>> = Pick<
  QueryEntityOpts<Project>,
  'project' | 'projectAccess'
>
export async function getEntity<
  EntityDataType extends SomeEntityDataType,
  Project extends ProjectVal<any>,
>(entityClass: EntityClass<EntityDataType>, key: string, opts?: GetEntityOpts<Project>) {
  const getCursor = await queryEntities(entityClass, 'r', {
    bindVars: { key },
    preAccessBody: `FILTER entity._key == @key LIMIT 1`,
    project: opts?.project,
    projectAccess: opts?.projectAccess,
  })
  const getRecord = await getCursor.next()
  console.log(inspect({ getRecord }, false, 10, true))
  return getRecord
}

// export async function getEntityAccess<EntityDataType extends SomeEntityDataType>(
//   entityClass: EntityClass<EntityDataType>,
//   key:string,
// ) {
//   const key = getKey(byKeyOrId)
//   const cursor = await queryEntities<EntityDataType>(
//     entityClass,
//     `FILTER entity._key == "${key}" LIMIT 1`,
//   )
//   const get_findResult = (await cursor.all())[0]
//   console.log(inspect({ get_findResult }, false, 10, true))
//   return get_findResult
// }

type QueryEntityOpts<Project extends ProjectVal<any>> = {
  preAccessBody?: string
  postAccessBody?: string
  project?: Project
  bindVars?: Record<string, any>
  projectAccess?: EntityAccess[]
}
export async function queryEntities<
  EntityDataType extends SomeEntityDataType,
  Project extends ProjectVal<any>,
>(entityClass: EntityClass<EntityDataType>, access: EntityAccess, opts?: QueryEntityOpts<Project>) {
  type _QueryRecordType = {
    entity: Omit<EntityDocument<EntityDataType>, '_meta'>
    meta: EntityMetadata
    access: { [access in EntityAccess]?: boolean }
  } & ProjectRes<Project>

  const isRead = access === 'r'
  const currentUser = await getCurrentSystemUser()
  if (!isRead && currentUser.type === 'anon') {
    return db.query<_QueryRecordType>('for x in [] return x')
  }

  const entityCollectionName = getEntityCollectionName(entityClass)

  const entityAccessesToCompute = [
    ...new Set<EntityAccess>([
      access,
      ...(isRead ? [] : (['r'] as EntityAccess[])),
      ...(opts?.projectAccess ?? []),
    ]),
  ]
  // console.log({ entityAccessesToCompute, access, opts_projectAccess: opts?.projectAccess })
  const accessControlsAqlRawProps = (
    await Promise.all(
      entityAccessesToCompute.map(async _entityAccess => {
        const accessStr = await getAQLAccessControlObjectDefString(currentUser, _entityAccess)
        return `${_entityAccess}: ${accessStr}`
      }),
    )
  ).join(',\n')

  const accessFlagsAqlRawProps = entityAccessesToCompute
    .map(_entityAccess => {
      return `${_entityAccess}: (accessControls.${_entityAccess} NONE == false) && (accessControls.${_entityAccess} ANY == true)`
    })
    .join(',\n')

  const projectAqlRawProps = opts?.project
    ? Object.entries(opts.project)
        .map(([key, keyPrjStr]) => `  ${key}: ${keyPrjStr},`)
        .join('\n')
    : ''

  const currentUserEntityAql =
    currentUser.type === 'entity' ? entityDocument(currentUser.entityIdentifier) : 'null'

  const q = `
LET currentUser = @currentUser
LET currentUserEntity = ${currentUserEntityAql}

// if currentUser.type === 'entity' && currentUserEntity === null
// the query should fail early with error !

FOR entity in @@collection
    
${opts?.preAccessBody ?? '// NO PRE_ACCESS_BODY'}
LET accessControls = {
  ${accessControlsAqlRawProps}
}
LET access = {
  ${accessFlagsAqlRawProps}
}

FILTER ${!isRead ? 'access.r &&' : ''} access.${access}

${opts?.postAccessBody ?? '// NO POST_ACCESS_BODY'}

return {
  entity: UNSET(entity, '_meta'),
  meta: entity._meta,
  access,
${projectAqlRawProps}
}
`

  const bindVars = { '@collection': entityCollectionName, currentUser, ...opts?.bindVars }
  console.log(q, inspect({ bindVars }, false, 10, true))
  const queryCursor = await db.query<_QueryRecordType>(q, bindVars)

  return queryCursor
}

// export function docIsOfClass<EntityDataType extends SomeEntityDataType>(
//   doc: EntityDocument<any>,
//   entityClass: EntityClass<EntityDataType>,
// ): doc is EntityDocument<EntityDataType> {
//   return isSameClass(entityClass, doc._meta.entityClass)
// }

export function isSameClass<EntityDataType extends SomeEntityDataType>(
  target: EntityClass<EntityDataType>,
  someClass: EntityClass<SomeEntityDataType>,
): someClass is EntityClass<EntityDataType> {
  return target.pkgName === someClass.pkgName && target.type === someClass.type
}

function neitherUndefinedOrNull<T>(_: T | undefined | null): _ is T {
  return _ !== undefined && _ !== null
}

// function getKey(ByKeyOrId: ByKeyOrId) {
//   if ('_key' in ByKeyOrId) {
//     return ByKeyOrId._key
//   } else {
//     const _key = ByKeyOrId._id.split('/')[0]
//     assert(_key)
//     return _key
//   }
// }

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

async function getAQLAccessControlObjectDefString(systemUser: SystemUser, access: EntityAccess) {
  if (systemUser.type === 'root') {
    return `[ true ] /* ROOT ALWAYS CONSENT ACCESS */`
  }
  if (systemUser.type === 'pkg') {
    return `[ true ] /* PKG CURRENTLY ALWAYS CONSENT ACCESS */`
  }
  if (access !== 'r' && systemUser.type === 'anon') {
    return `[ false ] /* ANON CANNOT WRITE SYSTEM ENTITIES */`
  }

  const accessElemsString = await getAqlEntityAccessControlArrayElemsString(access)

  return `[
    ${accessElemsString} 
  ]`
}

async function getAqlEntityAccessControlArrayElemsString(access: EntityAccess) {
  const entityAccessControlResponses = await Promise.all(
    accessControllerRegistry.map(({ accessControllers, pkgId }) =>
      accessControllers[access]?.({ myPkgMeta: pkgMetaOf(pkgId.name) }),
    ),
  )

  const aql = entityAccessControlResponses
    .filter(neitherUndefinedOrNull)
    .map(acElem => `(${acElem})`)
    .join(',\n')

  return `/* ^ Entity Access[${access}] ^ */
${aql}
/* $ Entity Access[${access}] $ */`
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
