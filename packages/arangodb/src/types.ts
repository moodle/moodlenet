import { ExtDef, SubTopo } from '@moodlenet/core'
import * as arango from 'arangojs'
import { DocumentCollection, EdgeCollection } from 'arangojs/collection'
import { Dict } from 'arangojs/connection'
import { QueryOptions } from 'arangojs/database'
import { IndexDefType } from './index'

export type CollectionType = 'edge' | 'node'
export type CollectionOpts = { indexes?: IndexDefType[] }
export type CollectionDef<Type extends {} = {}> = readonly [collectionType: CollectionType, docType: Type]
export type CollectionDefsMap<Defs extends Record<string, CollectionDef> = Record<string, CollectionDef>> = Defs

export type CollectionDefsOpts<Defs extends CollectionDefsMap> = {
  readonly [collName in keyof Defs]: readonly [type: Defs[collName][0], opts?: CollectionOpts] //& { _?: Defs[collName][1] }
}
export type CollectionsMap<Defs extends CollectionDefsMap> = {
  readonly [collectionName in keyof Defs]: Defs[collectionName][0] extends 'node'
    ? DocumentCollection<Defs[collectionName][1]>
    : EdgeCollection<Defs[collectionName][1]>
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
  ensureDocumentCollections<Defs extends CollectionDefsMap>(_: {
    defs: CollectionDefsOpts<Defs>
  }): Promise<CollectionsMap<Defs>>
  query(_: QueryReq): Promise<QueryRes>
}
type Routes = {
  ensureDocumentCollections: SubTopo<{ defs: Record<string, CollectionOpts> }, void>
  query: SubTopo<QueryReq, QueryRes>
}
export type MNArangoDBExt = ExtDef<'@moodlenet/arangodb', '0.1.0', Instance, Routes>
