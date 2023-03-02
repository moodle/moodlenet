import type { DocumentCollection, DocumentMetadata } from '@moodlenet/arangodb/server'
import { UserId } from '@moodlenet/authentication-manager/server'
import type { PkgName } from '@moodlenet/core'

// export type EntityIdentifier = { _id: string } | { _key: string; entityClass: EntityClass }

export type SomeEntityDataType = Record<string, any>

export type EntityClass<_EntityDataType extends SomeEntityDataType> = {
  pkgName: string
  type: string
}

export type EntityMetadata = {
  entityClass: EntityClass<any>
  owner: UserId
  creator: UserId
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
}

export type EntityCollectionDefs = { [name in string]: EntityCollectionDef<any> }
export type EntityCollectionHandles<Defs extends EntityCollectionDefs> = {
  [name in keyof Defs]: EntityCollectionHandle<Defs[name]>
}

export type EntityCollectionDefOpts = unknown

export type AccessControllers = {
  c(entityClass: EntityClass<SomeEntityDataType>): Promise<boolean | null | undefined>
  r: AqlAccessController
  u: AqlAccessController
  d: AqlAccessController
}

export type AqlAccessController = (_: {
  myPkgMeta: string
}) => Promise<string | null | undefined | boolean>
