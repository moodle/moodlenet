import type {
  DocumentCollection,
  DocumentMetadata,
  DocumentSelector,
  Patch,
} from '@moodlenet/arangodb/server'
import { UserId } from '@moodlenet/authentication-manager/server'
import type { PkgIdentifier, PkgName } from '@moodlenet/core'

export type EntityIdentifier = { _id: string } | { _key: string; entityClass: EntityClass }

export type EntityClass = {
  pkgName: string
  type: string
}

export type EntityMetadata = {
  entityClass: EntityClass
  owner?: UserId
  created: string
  updated: string
  pkgMeta: Record<PkgName, any>
}

export type EntityDocument<DataType extends Record<string, any>> = EntityData<DataType> &
  DocumentMetadata

export type EntityData<DataType extends Record<string, any>> = {
  _meta: EntityMetadata
} & DataType

export type EntityCollectionDef<DataType extends Record<string, any>> = {
  dataType: DataType
}

export type EntityCollectionHandle<Def extends EntityCollectionDef<any>> = {
  collection: DocumentCollection<EntityData<Def['dataType']>>
  create(
    newEntityData: Def['dataType'],
  ): Promise<
    | { accessControl: true; newEntity: EntityDocument<Def['dataType']> }
    | { accessControl: false; controllerDenies: ControllerDeny[] }
  >
  patch(
    sel: DocumentSelector,
    patchEntityData: Patch<Def['dataType']>,
  ): Promise<null | {
    old: EntityDocument<Def['dataType']>
    new: EntityDocument<Def['dataType']>
  }>
  remove(sel: DocumentSelector): Promise<null | EntityDocument<Def['dataType']>>
  get(sel: DocumentSelector): Promise<null | EntityDocument<Def['dataType']>>
  is(doc: EntityDocument<any>): doc is EntityDocument<Def['dataType']>
}

export type EntityCollectionDefs = { [name in string]: EntityCollectionDef<any> }
export type EntityCollectionHandles<Defs extends EntityCollectionDefs> = {
  [name in keyof Defs]: EntityCollectionHandle<Defs[name]>
}

export type EntityCollectionDefOpts = unknown

export type AccessController = {
  create(entityClass: EntityClass): Promise<unknown>
  read(entity: EntityDocument<any>): Promise<unknown>
  update(entity: EntityDocument<Record<string, any>>): Promise<unknown>
  delete(entity: EntityDocument<any>): Promise<unknown>
}

export type ControllerDeny = { pkgId: PkgIdentifier; error: unknown }
export type AccessType = 'create' | 'read' | 'update' | 'delete'
export type AccessError = {
  accessType: AccessType
  entityClass: EntityClass
  controllerDenies: ControllerDeny[]
}
