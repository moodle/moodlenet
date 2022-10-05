import * as arango from 'arangojs'
import { CollectionMetadata, DocumentCollection, EdgeCollection } from 'arangojs/collection.js'
import { Dict } from 'arangojs/connection.js'
import { QueryOptions } from 'arangojs/database.js'
import * as Indexes from 'arangojs/indexes.js'

export type CollectionKind = 'edge' | 'node'
export type CollectionOpts = { indexes?: IndexDefType[] }
export type CollectionDef<Kind extends CollectionKind = CollectionKind, Type extends {} = {}> = {
  kind: Kind
  type: Type
}
export type CollectionDefsMap<Defs extends Record<string, CollectionDef> = Record<string, CollectionDef>> = Defs

export type CollectionDefOpt<Kind extends CollectionKind = CollectionKind> = { kind: Kind; opts?: CollectionOpts }
export type CollectionDefOptMap<Defs extends CollectionDefsMap = CollectionDefsMap> = {
  readonly [collName in keyof Defs]: CollectionDefOpt<Defs[collName]['kind']>
}

export type CollectionHandle<Def extends CollectionDef> = {
  collection: Def['kind'] extends 'node' ? DocumentCollection<Def['type']> : EdgeCollection<Def['type']>
}

export type CollectionHandlesMap<Defs extends CollectionDefsMap = CollectionDefsMap> = {
  readonly [collectionName in keyof Defs]: CollectionHandle<Defs[collectionName]>
}
export type DocTypesMap = Record<string, any>
// export type CollectionOptsMap<Types extends DocTypesMap = DocTypesMap> = {
//   [collectionName in keyof Types]: CollectionOpts
// }
// export type CollectionsMap<Types extends DocTypesMap = DocTypesMap> = {
//   [collectionName in keyof Types]: DocumentCollection<Types[collectionName]>
// }
// export type DocumentCollectionMap<Types extends DocTypesMap = DocTypesMap> = {
//   [collectionName in keyof Types]: DocumentCollection<Types[collectionName]>
// }
// export type EdgeCollectionMap<Types extends DocTypesMap = DocTypesMap> = {
//   [collectionName in keyof Types]: EdgeCollection<Types[collectionName]>
// }
export type QueryReq = { q: string; opts?: QueryOptions; bindVars?: Dict<any> }
export type QueryRes = { resultSet: any[] }

export interface Instance {
  arango: typeof arango
  collections(): Promise<{ collectionsMeta: CollectionMetadata[] }>
  dropCollection(_: { name: string }): Promise<boolean>
  ensureCollections<Defs extends CollectionDefsMap>(_: {
    defs: CollectionDefOptMap<Defs>
  }): Promise<CollectionHandlesMap<Defs>>
  query(_: QueryReq): Promise<QueryRes>
}

export type IndexDefType = { name: string } & (
  | Indexes.EnsurePersistentIndexOptions
  | Indexes.EnsureTtlIndexOptions
  | Indexes.EnsureZkdIndexOptions
  | Indexes.EnsureFulltextIndexOptions
  | Indexes.EnsureGeoIndexOptions
)
