import { ensureDocumentCollection, Patch } from '@moodlenet/arangodb/server'
import { getCurrentClientSession } from '@moodlenet/authentication-manager/server'
import type { PkgIdentifier, PkgName } from '@moodlenet/core'
import assert from 'assert'
import { inspect } from 'util'
import { db } from './init.mjs'
import { shell } from './shell.mjs'
import {
  AccessControllers,
  AqlAccessController,
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
  SomeEntityDataType,
} from './types.mjs'

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
  controller: Partial<AccessControllers>
  pkgId: PkgIdentifier
}
const accessControllerRegistry: AccessControllerRegistry = []
export async function registerAccessController(controller: Partial<AccessControllers>) {
  const { pkgId } = shell.assertCallInitiator()
  accessControllerRegistry.push({
    controller,
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

export async function create<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  newEntityData: EntityDataType,
) {
  const collection = await getEntityCollection(entityClass)
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
      ).filter(neitherUndefinedOrNull)

  if (controllerDenies.length) {
    return {
      accessControl: false,
      controllerDenies,
    } as const
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
  if (!entityAccess.access.w.can) {
    throw new Error('no privilege to update')
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

export async function get<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  byKeyOrId: ByKeyOrId,
) {
  const entityAccess = await getEntityAccess(entityClass, byKeyOrId)
  return entityAccess?.access.r.can ? entityAccess.entity : null
}

export async function getEntityAccess<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  byKeyOrId: ByKeyOrId,
) {
  const key = getKey(byKeyOrId)
  const cursor = await find<EntityDataType>(
    entityClass,
    `
    FILTER entity._key == "${key}"
    LIMIT 1
  `,
  )
  const get_findResult = (await cursor.all())[0]
  console.log(inspect({ get_findResult }, false, 10, true))
  return get_findResult
}

export async function find<EntityDataType extends SomeEntityDataType>(
  entityClass: EntityClass<EntityDataType>,
  queryBody: string,
  // opts?:Partial<{filter:('r'|'w'|'d')[]}>
) {
  const entityCollectionName = getEntityCollectionName(entityClass)
  const clientSession = await getCurrentClientSession()
  const { aql: aqlAccessControlsObjString /* , directDenies  */ } =
    await getAQLAccessControlObjectDefStringAndDirectDenies(entityClass, clientSession?.isRoot)

  const q = `
    LET clientSession = @clientSession
    FOR entity in @@collection
    ${queryBody}
    LET accessControls = ${aqlAccessControlsObjString}
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

  const bindVars = { '@collection': entityCollectionName, clientSession }
  console.log(q, bindVars)
  const updateResponseCursor = await db.query<{
    entity: EntityDocument<EntityDataType>
    access: {
      r: { can: boolean }
      w: { can: boolean }
      d: { can: boolean }
    }
  }>(q, bindVars)
  return updateResponseCursor
}

// const delete: EntityCollectionHandle<Def>['delete'] = async sel => {
//   const { old } = await collection.remove(sel, { returnOld: true })
//   if (!old) {
//     return null
//   }
//   return old
// }

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

async function getAQLAccessControlObjectDefStringAndDirectDenies(
  entityClass: EntityClass<SomeEntityDataType>,
  rootAccess = false,
) {
  if (rootAccess) {
    return {
      aql: `{
        r: [ true ] /* ROOT ACCESS */,
        w: [ true ] /* ROOT ACCESS */,
        d: [ true ] /* ROOT ACCESS */,
      }`,
      directDenies: {
        r: false,
        d: false,
        w: false,
      },
    } as const
  }

  const [
    rAccessElemsStringAndDirectDeny,
    wAccessElemsStringAndDirectDeny,
    dAccessElemsStringAndDirectDeny,
  ] = await Promise.all([
    getAqlOperationAccessControlArrayElemsStringAndDirectDeny(
      entityClass,
      accessControllerRegistry.map(({ controller }) => controller.read),
    ),
    getAqlOperationAccessControlArrayElemsStringAndDirectDeny(
      entityClass,
      accessControllerRegistry.map(({ controller }) => controller.write),
    ),
    getAqlOperationAccessControlArrayElemsStringAndDirectDeny(
      entityClass,
      accessControllerRegistry.map(({ controller }) => controller.delete),
    ),
  ])

  const directDenies = {
    r: rAccessElemsStringAndDirectDeny.directDeny,
    w: wAccessElemsStringAndDirectDeny.directDeny,
    d: dAccessElemsStringAndDirectDeny.directDeny,
  }

  const aql = `{
        r: [ ${rAccessElemsStringAndDirectDeny.elemsString} ],
        w: [ ${wAccessElemsStringAndDirectDeny.elemsString} ],
        d: [ ${dAccessElemsStringAndDirectDeny.elemsString} ],
      }`
  return { aql, directDenies } as const
}

async function getAqlOperationAccessControlArrayElemsStringAndDirectDeny(
  entityClass: EntityClass<SomeEntityDataType>,
  aqlAccessController: (AqlAccessController | undefined | null)[],
) {
  const operationAccessControlResponses = await Promise.all(
    aqlAccessController.map(controller => controller?.(entityClass)),
  )

  const directDeny = operationAccessControlResponses.includes(false)

  const elemsString = operationAccessControlResponses
    .filter(neitherUndefinedOrNull)
    .map(acElem => `(${acElem})`)
    .join(',\n')

  return { elemsString, directDeny }
}
