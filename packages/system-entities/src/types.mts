import type { DocumentCollection, DocumentMetadata } from '@moodlenet/arangodb/server'
import { UserId } from '@moodlenet/authentication-manager/server'
import type { PkgIdentifier, PkgName } from '@moodlenet/core'

// export type EntityIdentifier = { _id: string } | { _key: string; entityClass: EntityClass }

export type SomeEntityDataType = Record<string, any>

export type EntityClass<_EntityDataType extends SomeEntityDataType> = {
  pkgName: string
  type: string
}

export type EntityMetadata = {
  entityClass: EntityClass<any>
  owner?: UserId
  created: string
  updated: string
  pkgMeta: Record<PkgName, any>
}

export type EntityDocument<EntityDataType extends SomeEntityDataType> = EntityData<EntityDataType> &
  DocumentMetadata

export type EntityData<EntityDataType extends SomeEntityDataType> = {
  _meta: EntityMetadata
} & EntityDataType

export type EntityCollectionDef<EntityDataType extends SomeEntityDataType> = {
  dataType: EntityDataType
}
export type ByKeyOrId = { _id: string } | { _key: string }
export type EntityCollectionHandle<Def extends EntityCollectionDef<any>> = {
  collection: DocumentCollection<EntityData<Def['dataType']>>
  entityClass: EntityClass<Def['dataType']>
  // create(
  //   newEntityData: Def['dataType'],
  // ): Promise<
  //   | { accessControl: true; newEntity: EntityDocument<Def['dataType']> }
  //   | { accessControl: false; controllerDenies: ControllerDeny[] }
  // >
  // patch(
  //   byKeyOrId: ByKeyOrId,
  //   patchEntityData: Patch<Def['dataType']>,
  // ): Promise<null | {
  //   old: EntityDocument<Def['dataType']>
  //   new: EntityDocument<Def['dataType']>
  // }>
  // delete(sel: DocumentSelector): Promise<null | EntityDocument<Def['dataType']>>
  // get(sel: DocumentSelector): Promise<null | EntityDocument<Def['dataType']>>
  // is(doc: EntityDocument<any>): doc is EntityDocument<Def['dataType']>
}

export type EntityCollectionDefs = { [name in string]: EntityCollectionDef<any> }
export type EntityCollectionHandles<Defs extends EntityCollectionDefs> = {
  [name in keyof Defs]: EntityCollectionHandle<Defs[name]>
}

export type EntityCollectionDefOpts = unknown

export type AccessControllers = {
  create(entityClass: EntityClass<any>): Promise<unknown>
  read: AqlAccessController
  write: AqlAccessController
  delete: AqlAccessController
}

export type AqlAccessController = (
  entityClass: EntityClass<any>,
) => Promise<string | null | undefined | boolean>

export type ControllerDeny = { pkgId: PkgIdentifier; error: unknown }
export type AccessType = 'create' | 'read' | 'update' | 'delete'
export type AccessError = {
  accessType: AccessType
  entityClass: EntityClass<any>
  controllerDenies: ControllerDeny[]
}
