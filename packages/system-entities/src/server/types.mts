import type { DocumentCollection, DocumentMetadata } from '@moodlenet/arangodb/server'
import type { PkgName } from '@moodlenet/core'
import type { EntityClass, EntityIdentifier, SomeEntityDataType } from '../common/types.mjs'

export type AqlVal<_T = unknown> = string & { $$AqlVal$$?: _T }

export type EntityMetadata = {
  entityClass: EntityClass<any>
  creator: SystemUser
  creatorEntityId?: string
  created: string
  updated: string
  pkgMeta: Record<PkgName, any>
}

export type EntityFullDocument<EntityDataType extends SomeEntityDataType> =
  EntityDocFullData<EntityDataType> & DocumentMetadata

export type EntityDocument<EntityDataType extends SomeEntityDataType> = EntityDataType &
  DocumentMetadata

export type EntityDocFullData<EntityDataType extends SomeEntityDataType> = {
  _meta: EntityMetadata
} & EntityDataType

export type EntityCollectionDef<EntityDataType extends SomeEntityDataType> = {
  dataType: EntityDataType
}
export type ByKeyOrId = { _id: string } | { _key: string }
export type EntityCollectionHandle<Def extends EntityCollectionDef<any>> = {
  collection: DocumentCollection<EntityDocFullData<Def['dataType']>>
  entityClass: EntityClass<Def['dataType']>
}

export type EntityCollectionDefs = { [name in string]: EntityCollectionDef<any> }
export type EntityCollectionHandles<Defs extends EntityCollectionDefs> = {
  [name in keyof Defs]: EntityCollectionHandle<Defs[name]>
}

export type EntityCollectionDefOpts = unknown

export type AccessControllers = {
  [op in EntityAccess]: AqlAccessController
} & {
  c(
    entityClass: EntityClass<SomeEntityDataType>,
  ): null | undefined | boolean | Promise<boolean | null | undefined>
}
export type EntityAccess = 'r' | 'u' | 'd'

export type AqlAccessController = (_: { myPkgMeta: AqlVal }) => AqlAccessControllerResp

type AqlAccessControllerResp = AqlAccessControllerRespValue | Promise<AqlAccessControllerRespValue>
type AqlAccessControllerRespValue = AqlVal<null | boolean> | null | undefined | boolean

export type SystemUser = EntityUser | RootUser | AnonUser | PkgUser
export type EntityUser = {
  type: 'entity'
  entityIdentifier: EntityIdentifier
  restrictToScopes: false | string[]
}

export type RootUser = {
  type: 'root'
}

export type AnonUser = {
  type: 'anon'
}

export type PkgUser = {
  type: 'pkg'
  pkgName: PkgName
}
