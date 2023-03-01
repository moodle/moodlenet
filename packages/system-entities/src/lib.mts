import { ensureDocumentCollection, Patch } from '@moodlenet/arangodb/server'
import { getCurrentClientSession } from '@moodlenet/authentication-manager/server'
import type { PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import { inspect } from 'util'
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
  const { pkgId } = shell.assertCallInitiator()

  const entityClass: EntityClass = {
    pkgName: pkgId.name,
    type: entityName,
  }

  const entityCollectionName = getEntityCollectionName(pkgId, entityName)
  const { collection /* , newlyCreated */ } = await shell.call(ensureDocumentCollection)<
    EntityData<DataType>
  >(entityCollectionName)

  return {
    collection,
    entityClass,
  }
}

export async function create<Def extends EntityCollectionDef<any>>(
  handle: EntityCollectionHandle<Def>,
  newEntityData: Def['dataType'],
) {
  const clientSession = await getCurrentClientSession()
  const controllerDenies = clientSession?.isRoot
    ? []
    : (
        await Promise.all(
          accessControllerRegistry.map(({ controller, pkgId }) => {
            return Promise.resolve(controller.create?.(handle.entityClass))
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
    } as const
  }

  const userKey = (await getCurrentClientSession())?.user?._key

  const now = new Date().toISOString()

  const { new: newEntity } = await handle.collection.save(
    {
      ...newEntityData,
      _meta: {
        owner: userKey,
        updated: now,
        created: now,
        entityClass: handle.entityClass,
        pkgMeta: {},
      },
    },
    { returnNew: true },
  )
  assert(newEntity)
  return { newEntity, accessControl: true } as const
}

export async function patch<Def extends EntityCollectionDef<any>>(
  handle: EntityCollectionHandle<Def>,
  byKeyOrId: ByKeyOrId,
  entityDataPatch: Patch<Def['dataType']>,
) {
  const entityAccess = await getEntityAccess(handle, byKeyOrId)
  if (!entityAccess) {
    return
  }
  if (!entityAccess.access.w.can) {
    throw new Error('no privilege to update')
  }
  const entityPatch = {
    ...entityDataPatch,
    _meta: {
      updated: new Date().toISOString(),
    },
  }

  const { new: newEntityData, old: oldEntityData } = await handle.collection.update(
    byKeyOrId,
    entityPatch,
    { mergeObjects: true, returnNew: true, returnOld: true },
  )

  assert(newEntityData && oldEntityData)
  return { new: newEntityData, old: oldEntityData }
}

export async function get<Def extends EntityCollectionDef<any>>(
  handle: EntityCollectionHandle<Def>,
  byKeyOrId: ByKeyOrId,
) {
  const entityAccess = await getEntityAccess(handle, byKeyOrId)
  return entityAccess?.access.r.can ? entityAccess.entity : null
}

export async function getEntityAccess<Def extends EntityCollectionDef<any>>(
  handle: EntityCollectionHandle<Def>,
  byKeyOrId: ByKeyOrId,
) {
  const key = getKey(byKeyOrId)
  const cursor = await find<Def>(
    handle,
    `
    FILTER entity._key == "${key}"
    LIMIT 1
  `,
  )
  const get_findResult = (await cursor.all())[0]
  console.log(inspect({ get_findResult }, false, 10, true))
  return get_findResult
}

export async function find<Def extends EntityCollectionDef<any>>(
  handle: EntityCollectionHandle<Def>,
  queryBody: string,
  // opts?:Partial<{filter:('r'|'w'|'d')[]}>
) {
  type DataType = Def extends EntityCollectionDef<infer T> ? T : never
  const clientSession = await getCurrentClientSession()
  const rAccess = 'true'
  const dAccess = 'true'
  const wAccess = (
    await Promise.all(
      accessControllerRegistry.map(({ controller /* , pkgId */ }) => controller.update?.()),
    )
  )
    .map(_ => `(${_})`)
    .join(',\n')
  const accessControls = clientSession?.isRoot
    ? `{
        r: [ true ] /* ROOT ACCESS */,
        w: [ true ] /* ROOT ACCESS */,
        d: [ true ] /* ROOT ACCESS */,
      }`
    : ` {
        w: [ ${wAccess} ],
        r: [ ${rAccess} ],
        d: [ ${dAccess} ],
      }`

  const q = `
LET clientSession = @clientSession
FOR entity in @@collection
${queryBody}
LET accessControls = ${accessControls}
LET access = {
  r: { 
    can: (accessControls.r NONE == false) && (accessControls.r ANY == true) 
  },
  w:  { 
    can: (accessControls.w NONE == false) && (accessControls.w ANY == true) 
  },
  d:  { 
    can: (accessControls.d NONE == false) && (accessControls.d ANY == true) 
  }
}
return { 
  entity,
  access
}
`

  const bindVars = { '@collection': handle.collection.name, clientSession }
  console.log(q, bindVars)
  const updateResponseCursor = await db.query<{
    entity: EntityDocument<DataType>
    access: {
      r: { can: boolean }
      w: { can: boolean }
      d: { can: boolean }
    }
  }>(q, bindVars)
  return updateResponseCursor
}

// const remove: EntityCollectionHandle<Def>['remove'] = async sel => {
//   const { old } = await collection.remove(sel, { returnOld: true })
//   if (!old) {
//     return null
//   }
//   return old
// }

export function docIsOfClass<T extends Record<string, any>>(
  doc: EntityDocument<any>,
  entityClass: EntityClass,
): doc is EntityDocument<T> {
  return isSameClass(entityClass, doc._meta.entityClass)
}

export function isSameClass<EC extends EntityClass>(class1: EC, class2: EntityClass): class2 is EC {
  return class1.pkgName === class2.pkgName && class1.type === class2.type
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
