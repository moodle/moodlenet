import type { ArangoSearchViewLinkOptions, Patch } from '@moodlenet/arangodb/server'
import { ensureDocumentCollection } from '@moodlenet/arangodb/server'
import type { PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import { customAlphabet } from 'nanoid'
import { entityIdByIdentifier, getEntityFullTypename } from '../common/entity-identification.mjs'
import type { EntityClass, SomeEntityDataType } from '../common/types.mjs'
import {
  creatorEntityDocVar,
  creatorEntityIdVar,
  currentEntityClass,
  currentEntityVar,
  isCurrentUserCreatorOfCurrentEntity,
  toaql,
} from './aql-lib/aql.mjs'
import { entityDocument2Aql, pkgMetaOf2Aql } from './aql-lib/by-proc-values.mjs'
import { userInfoAqlProvider } from './aql-lib/userInfo.mjs'
import type { EntityInfo, EntityInfoProviderItem } from './entity-info.mjs'
import { ENTITY_INFO_PROVIDERS } from './entity-info.mjs'
import { db, SearchAliasView, SEARCH_VIEW_NAME } from './init/arangodb.mjs'
import { env } from './init/env.mjs'
import { getEntityCollection } from './pkg-db-names.mjs'
import { shell } from './shell.mjs'
import type {
  AccessControllers,
  AnonUser,
  AqlVal,
  EntityAccess,
  EntityCollectionDef,
  EntityCollectionDefOpts,
  EntityCollectionDefs,
  EntityCollectionHandle,
  EntityCollectionHandles,
  EntityDocFullData,
  EntityDocument,
  EntityMetadata,
  PkgUser,
  RootUser,
  SystemUser,
} from './types.mjs'
import type { CurrentUserFetchedCtx, FetchCurrentUser } from './types.private.mjs'
const DEFAULT_QUERY_LIMIT = 25
const DEFAULT_MAX_QUERY_LIMIT = 200
export async function registerEntities<
  Defs extends EntityCollectionDefs<EntityNames>,
  EntityNames extends string, // = string,
>(entities: {
  [name in keyof Defs]: EntityCollectionDefOpts
}): Promise<EntityCollectionHandles<Defs>> {
  const namesAndHandles = await Promise.all(
    Object.entries<EntityCollectionDefOpts>(entities).map(([entityName, defOpt]) =>
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

  const entityCollectionName = getEntityFullTypename(entityClass)
  const { collection /* , newlyCreated */ } = await shell.call(ensureDocumentCollection)<
    EntityDocFullData<EntityDataType>
  >(entityCollectionName)

  return {
    collection,
    entityClass,
  }
}
export async function addTextSearchFields(collectionName: string, filedNames: string[]) {
  const props = await SearchAliasView.properties()
  assert(props.type === 'arangosearch')

  SearchAliasView.updateProperties({
    links: {
      [collectionName]: {
        analyzers: ['text_en', 'global-text-search'],
        fields: filedNames.reduce(
          (_acc, fieldName) => ({ ..._acc, [fieldName]: {} }),
          {} as Record<string, ArangoSearchViewLinkOptions>,
        ),
        includeAllFields: false,
        storeValues: 'none',
        trackListPositions: false,
      },
    },
  })
}

export async function canCreateEntity(entityClass: EntityClass<SomeEntityDataType>) {
  const currentUser = await getCurrentSystemUser()
  if (currentUser.type === 'root') {
    return true
  } else if (currentUser.type === 'pkg') {
    return true // currentUser.pkgName === entityClass.pkgName
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
  newEntityData: EntityDataType & { _key?: string },
  opts?: { pkgCreator?: boolean },
) {
  const currentUser = opts?.pkgCreator ? await setPkgCurrentUser() : await getCurrentSystemUser()
  const _key = newEntityData._key ?? createEntityKey()
  // shell.log('debug', { currentUser })
  const canCreate = await canCreateEntity(entityClass)
  if (!canCreate) {
    return
  }

  const now = shell.now().toISOString()

  const collection = await getEntityCollection(entityClass)
  const { new: newEntity } = await collection.save(
    {
      ...newEntityData,
      _key,
      _meta: {
        creator: currentUser,
        creatorEntityId:
          currentUser.type === 'entity'
            ? entityIdByIdentifier(currentUser.entityIdentifier)
            : undefined,
        updated: now,
        created: now,
        entityClass,
        pkgMeta: {},
      },
    },
    { returnNew: true },
  )
  assert(
    newEntity,
    `failed to create entity although user passed canCreateEntity check
entity:
${JSON.stringify(newEntityData, null, 2)}
user:
${JSON.stringify(currentUser, null, 2)}
`,
  )
  shell.events.emit('created-new', { newEntity, creator: currentUser })
  return newEntity
}

export type PatchEntityOpts<
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
> = AccessEntitiesOpts<Project, ProjectAccess> & { matchRev?: string }
export async function patchEntity<
  EntityDataType extends SomeEntityDataType,
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(
  entityClass: EntityClass<EntityDataType>,
  key: string,
  entityDataPatch: Patch<EntityDataType> | AqlVal<Patch<EntityDataType>>,
  opts?: PatchEntityOpts<Project, ProjectAccess>,
) {
  const isAqlEntityDataPatch = typeof entityDataPatch === 'string'
  const aqlPatchVar = isAqlEntityDataPatch ? entityDataPatch : toaql(entityDataPatch)
  const matchRevFilter = opts?.matchRev
    ? `${currentEntityVar}._rev == ${toaql(opts.matchRev)} && `
    : ''
  const patchCursor = await accessEntities(entityClass, 'u', {
    ...opts,
    preAccessBody: `${opts?.preAccessBody ?? ''} 
    FILTER ${matchRevFilter} ${currentEntityVar}._key == ${toaql(key)} LIMIT 1`,
    postAccessBody: `${opts?.postAccessBody ?? ''} 
    UPDATE ${currentEntityVar} WITH UNSET(${aqlPatchVar}, '_meta') IN @@collection`,
    project: { patched: 'NEW' as AqlVal<EntityDocument<EntityDataType>> },
  })
  const patchRecord = await patchCursor.next()
  if (!patchRecord) {
    return
  }
  return { patched: patchRecord.patched, old: patchRecord.entity }
}

/* export async function patchEntity<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  key: string,
  { _meta: _, ...entityDataPatch }: Patch<EntityDataType> | AqlVal<Patch<EntityDataType>>,
  opts?: {
    meta?: AqlVal
    projectAccess?: EntityAccess[]
  },
) {
  const patchRecord = await updateEntity(
    entityClass,
    key,
    `WITH @entityDataPatch`,
    { entityDataPatch },
    opts,
  )
  return patchRecord
}

export async function updateEntity<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  key: string,
  updateBody: string,
  bindVars: Record<string, any>,
  opts?: {
    meta?: AqlVal
    projectAccess?: EntityAccess[]
  },
) {
  const updateCursor = await accessEntities(entityClass, 'u', {
    preAccessBody: `FILTER entity._key == @key LIMIT 1`,
    postAccessBody: `UPDATE entity ${updateBody} IN @@collection`,
    bindVars: { ...bindVars, key },
    project: { patched: 'NEW' as AqlVal<EntityDocument<EntityDataType>> },
    projectAccess: opts?.projectAccess,
  })
  const updateRecord = await updateCursor.next()
  return updateRecord
}
 */
export async function delEntity<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  key: string,
) {
  const delCursor = await accessEntities(entityClass, 'd', {
    bindVars: { key },
    preAccessBody: `FILTER entity._key == @key LIMIT 1`,
    postAccessBody: `REMOVE entity IN @@collection`,
  })
  const deleteRecord = await delCursor.next()
  return deleteRecord
}

export type GetEntityOpts<
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
> = AccessEntitiesOpts<Project, ProjectAccess>
export async function getEntity<
  EntityDataType extends SomeEntityDataType,
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(
  entityClass: EntityClass<EntityDataType>,
  key: string,
  opts?: GetEntityOpts<Project, ProjectAccess>,
) {
  const getCursor = await accessEntities(entityClass, 'r', {
    bindVars: { key },
    preAccessBody: `FILTER entity._key == @key LIMIT 1`,
    project: opts?.project,
    projectAccess: opts?.projectAccess,
  })
  const getRecord = await getCursor.next()
  // shell.log('debug', inspect({ getRecord }, false, 10, true))
  return getRecord
}

export type QueryEntitiesPageOpts = {
  skip?: number
  limit?: number
  sort?: string
}
export type QueryEntitiesOpts<
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
> = AccessEntitiesOpts<Project, ProjectAccess> & QueryEntitiesPageOpts
export async function queryEntities<
  EntityDataType extends SomeEntityDataType,
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(entityClass: EntityClass<EntityDataType>, opts?: QueryEntitiesOpts<Project, ProjectAccess>) {
  const _reqLimit = opts?.limit ?? DEFAULT_QUERY_LIMIT
  const limit = _reqLimit > DEFAULT_MAX_QUERY_LIMIT ? DEFAULT_MAX_QUERY_LIMIT : _reqLimit
  const skip = Math.floor(opts?.skip ?? 0)
  const sort = opts?.sort ? `SORT ${opts.sort}` : ''
  const queryEntitiesCursor = await accessEntities(entityClass, 'r', {
    ...opts,
    postAccessBody: `
      ${opts?.postAccessBody ?? ''}
      ${sort}
      LIMIT ${skip}, ${limit}
    `,
  })
  return queryEntitiesCursor
}

export type QueryMyEntitiesOpts<
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
> = QueryEntitiesOpts<Project, ProjectAccess>
export async function queryMyEntities<
  EntityDataType extends SomeEntityDataType,
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(entityClass: EntityClass<EntityDataType>, opts?: QueryMyEntitiesOpts<Project, ProjectAccess>) {
  const queryMyEntitiesCursor = await queryEntities(entityClass, {
    ...opts,
    preAccessBody: `
      FILTER ${isCurrentUserCreatorOfCurrentEntity()}
      ${opts?.preAccessBody ?? ''}
    `,
  })
  return queryMyEntitiesCursor
}
// export async function getEntityAccess<EntityDataType extends SomeEntityDataType>(
//   entityClass: EntityClass<EntityDataType>,
//   key:string,
// ) {
//   const key = getKey(byKeyOrId)
//   const cursor = await accessEntities<EntityDataType>(
//     entityClass,
//     `FILTER entity._key == "${key}" LIMIT 1`,
//   )
//   const get_findResult = (await cursor.all())[0]
//   shell.log('info', inspect({ get_findResult }, false, 10, true))
//   return get_findResult
// }
export type AccessEntitiesCustomProject<P extends Record<string, AqlVal<any>>> = P
type BindVars = Record<string, any>

export type AccessEntitiesProjectResult<P> = {
  [k in keyof P]: P[k] extends AqlVal<infer T> ? T : any
}

export type AccessEntitiesRecordType<
  EntityDataType extends SomeEntityDataType,
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
> = {
  entity: Omit<EntityDocument<EntityDataType>, '_meta'>
  meta: EntityMetadata
  access: { [access in ProjectAccess]: boolean }
} & AccessEntitiesProjectResult<Project>

export type AccessEntitiesOpts<
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
> = {
  forOptions?: string
  preAccessBody?: string
  postAccessBody?: string
  project?: Project
  bindVars?: BindVars
  projectAccess?: ProjectAccess[]
  viaSearchView?: boolean
}

export async function getCurrentUserInfo() {
  const currentUser = await getCurrentSystemUser()
  const entityInfoAql = userInfoAqlProvider('currentUser')

  const cursor = await db.query<EntityInfo>(
    `LET currentUser = @currentUser 
    RETURN ${entityInfoAql}`,
    {
      currentUser,
    },
  )
  const entityInfo = await cursor.next()
  assert(entityInfo)
  return entityInfo
}

export async function searchEntities<
  EntityDataType extends SomeEntityDataType,
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(
  entityClass: EntityClass<EntityDataType>,
  givenSearchTerm: string,
  fields: { name: string; factor?: number }[],
  _opts?: QueryEntitiesOpts<Project, ProjectAccess>,
) {
  givenSearchTerm = givenSearchTerm.trim()
  const PERFORM_SEARCH_ANALIZERS = fields.length && givenSearchTerm
  if (!PERFORM_SEARCH_ANALIZERS) {
    const postAccessBody = `
    let rank = 1
    ${_opts?.postAccessBody ?? ''}`
    return queryEntities(entityClass, { ..._opts, postAccessBody })
  }
  const searchTermAql = toaql(givenSearchTerm)
  const allSearchstatements = fields
    .map(
      ({ name, factor = 1 }) => `
  BOOST(
        PHRASE(
                ${currentEntityVar}.${name}, 
                ${searchTermAql}
              ),
        ${10 * factor})
  OR
  BOOST(
        ${currentEntityVar}.${name} IN TOKENS(${searchTermAql}),
        ${3 * factor})
  OR
  BOOST(
        NGRAM_MATCH( ${currentEntityVar}.${name}, 
                      ${searchTermAql}, 
                      0.05, 
                      "global-text-search"
                    ), 
        ${0.1 * factor})
  `,
    )
    .join(`OR`)

  const postAccessBody = `
    let rank =  TFIDF(${currentEntityVar})
    ${_opts?.postAccessBody ?? ''}`

  const forOptions = `
  SEARCH ANALYZER(${allSearchstatements}, "text_en")`

  const opts: QueryEntitiesOpts<Project, ProjectAccess> = {
    ..._opts,
    forOptions,
    postAccessBody,
    viaSearchView: true,
    sort: _opts?.sort ?? 'rank',
  }
  return queryEntities(entityClass, opts)
}

export async function accessEntities<
  EntityDataType extends SomeEntityDataType,
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(
  entityClass: EntityClass<EntityDataType>,
  access: EntityAccess,
  opts?: AccessEntitiesOpts<Project, ProjectAccess>,
) {
  const isRead = access === 'r'
  const currentUser = await getCurrentSystemUser()
  if (!isRead && currentUser.type === 'anon') {
    return emptyCursor<EntityDataType, Project, ProjectAccess>()
  }

  const accessCollectionName = opts?.viaSearchView
    ? SEARCH_VIEW_NAME
    : getEntityFullTypename(entityClass)

  const entityAccessesToCompute = [
    ...new Set<EntityAccess>([
      access,
      ...(isRead ? [] : (['r'] as EntityAccess[])),
      ...(opts?.projectAccess ?? []),
    ]),
  ]
  // shell.log('debug', { entityAccessesToCompute, access, opts_projectAccess: opts?.projectAccess })
  const accessControlsAqlRawProps = (
    await Promise.all(
      entityAccessesToCompute.map(async _entityAccess => {
        const accessStr = await getAQLAccessControlObjectDefString(
          currentUser,
          _entityAccess,
          entityClass,
        )
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
    currentUser.type === 'entity' ? entityDocument2Aql(currentUser.entityIdentifier) : 'null'

  const q = `
LET currentUser = @currentUser
LET currentUserEntity = ${currentUserEntityAql}
// if currentUser.type === 'entity' && currentUserEntity === null
// the query should fail early with error !

FOR entity in @@collection ${opts?.forOptions ?? ''}

${opts?.viaSearchView ? `FILTER ${currentEntityClass}==${toaql(entityClass)}` : ``}

LET ${creatorEntityIdVar}=entity._meta.creator.type == 'entity' ? entity._meta.creatorEntityId : null

LET ${creatorEntityDocVar} = DOCUMENT(${creatorEntityIdVar})

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

  const bindVars = { '@collection': accessCollectionName, currentUser, ...opts?.bindVars }
  q.includes('/*DEBUG*/') && console.log(q, JSON.stringify(bindVars))
  // console.debug(JSON.stringify({ bindVars }))

  const queryCursor = await db
    .query<AccessEntitiesRecordType<EntityDataType, Project, ProjectAccess>>(q, bindVars, {
      retryOnConflict: 5,
    })
    .catch(e => {
      shell.log('error', e)
      shell.log('debug', q, JSON.stringify({ bindVars }))
      throw e
    })

  return queryCursor
}

function emptyCursor<
  EntityDataType extends SomeEntityDataType,
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>() {
  return db.query<AccessEntitiesRecordType<EntityDataType, Project, ProjectAccess>>(
    'for x in [] return x',
  )
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

async function getAQLAccessControlObjectDefString(
  systemUser: SystemUser,
  access: EntityAccess,
  entityClass: EntityClass<SomeEntityDataType>,
) {
  if (systemUser.type === 'root') {
    return `[ true ] /* ROOT ALWAYS CONSENT ACCESS */`
  }
  if (systemUser.type === 'pkg') {
    return `[ true ] /* PKG CURRENTLY ALWAYS CONSENT ACCESS */`
  }
  if (access !== 'r' && systemUser.type === 'anon') {
    return `[ false ] /* ANON CANNOT WRITE SYSTEM ENTITIES */`
  }

  const accessElemsString = await getAqlEntityAccessControlArrayElemsString(access, entityClass)

  return `[
    ${accessElemsString} 
  ]`
}

async function getAqlEntityAccessControlArrayElemsString(
  access: EntityAccess,
  entityClass: EntityClass<SomeEntityDataType>,
) {
  const entityAccessControlResponses = await Promise.all(
    accessControllerRegistry.map(({ accessControllers, pkgId }) =>
      accessControllers[access]?.({ myPkgMeta: pkgMetaOf2Aql(pkgId.name), entityClass }),
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

export async function assertCurrentEntitySystemUser() {
  const currentSystemUser = await getCurrentSystemUser()
  assert(currentSystemUser.type === 'entity')
  return currentSystemUser
}
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
  return currentPkgUser
}

export function registerEntityInfoProvider(providerItem: EntityInfoProviderItem) {
  ENTITY_INFO_PROVIDERS.push({ providerItem })
}

export const createEntityKey = customAlphabet(
  `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`,
  8,
)
