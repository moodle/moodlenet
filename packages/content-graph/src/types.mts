import type {
  DocumentCollection,
  DocumentMetadata,
  DocumentSelector,
  Patch,
  SearchAliasViewPatchIndexOptions,
} from '@moodlenet/arangodb/server'
import type { PkgName } from '@moodlenet/core'

export type EntityFullIdentifier = { _id: string } & EntityClass
export type EntityIdentifier = { _id: string }

export type EntityClass = {
  pkgName: string
  type: string
}

export type EntityMetadata = {
  searchData: SearchData
  entityClass: EntityClass
  creator?: {
    userKey: string
    // profileEid?:EntityIdentifier
  }
  created: string
  updated: string
  claims?: Record<PkgName, any>
}

export type EntityDocument<DataType extends Record<string, any>> = EntityData<DataType> &
  DocumentMetadata

// export type EntityData<DataType extends Record<string, any>> = DataType

export type EntityData<DataType extends Record<string, any>> = {
  _meta: EntityMetadata
} & DataType

export type SearchData = {
  title: string
  description: string
}

export type EntityCollectionDef<DataType extends Record<string, any>> = {
  dataType: DataType
}

export type EntityCollectionHandle<Def extends EntityCollectionDef<any>> = {
  collection: DocumentCollection<EntityData<Def['dataType']>>
  create: (
    newEntityData: Def['dataType'],
    newEntitySearchData: SearchData,
  ) => Promise<EntityDocument<Def['dataType']>>
  update: (
    sel: DocumentSelector,
    patchEntityData: Patch<Def['dataType']>,
    patchSearchData: Patch<SearchData>,
  ) => Promise<null | {
    old: EntityDocument<Def['dataType']>
    new: EntityDocument<Def['dataType']>
  }>
  remove: (sel: DocumentSelector) => Promise<null | EntityDocument<Def['dataType']>>
  get: (sel: DocumentSelector) => Promise<null | EntityDocument<Def['dataType']>>
}

export type EntityCollectionDefs = { [name in string]: EntityCollectionDef<any> }
export type EntityCollectionHandles<Defs extends EntityCollectionDefs> = {
  [name in keyof Defs]: EntityCollectionHandle<Defs[name]>
}

export type EntityCollectionDefOpts = {
  updateAdditionaIndexes?: Pick<Required<SearchAliasViewPatchIndexOptions>, 'index' | 'operation'>[]
}
