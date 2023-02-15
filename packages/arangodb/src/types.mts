import { CreateCollectionOptions, DocumentCollection, EdgeCollection } from 'arangojs/collection.js'
import { Dict } from 'arangojs/connection.js'
import { QueryOptions } from 'arangojs/database.js'

export type CollectionKind = 'edge' | 'node'
export type CreateCollectionDef<
  Kind extends CollectionKind = CollectionKind,
  DataType extends Record<string, any> = Record<string, any>,
> = {
  kind: Kind
  dataType: DataType
}

export type CreateCollectionOpts<Def extends CreateCollectionDef> = {
  kind: Def['kind']
} & Pick<CreateCollectionOptions, 'waitForSync' | 'keyOptions' | 'schema'>

export type CreateCollectionDefsMap = Record<string, CreateCollectionDef>

export type CreateCollectionOptsMap<Defs extends CreateCollectionDefsMap> = {
  [collName in keyof Defs]: CreateCollectionOpts<Defs[collName]>
}

export type CollectionHandle<Def extends CreateCollectionDef> = {
  collection: Def['kind'] extends 'node'
    ? DocumentCollection<Def['dataType']>
    : EdgeCollection<Def['dataType']>
}

export type CollectionHandlesMap<Defs extends CreateCollectionDefsMap = CreateCollectionDefsMap> = {
  readonly [collectionName in keyof Defs]: CollectionHandle<Defs[collectionName]>
}

export type QueryReq = { q: string; opts?: QueryOptions; bindVars?: Dict<any> }
export type QueryRes = { resultSet: any[] }
