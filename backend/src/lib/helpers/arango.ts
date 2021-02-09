import { Database } from 'arangojs'
import { CreateCollectionOptions, DocumentCollection, EdgeCollection } from 'arangojs/collection'
import { Config } from 'arangojs/connection'
import { CreateDatabaseOptions } from 'arangojs/database'
import { Maybe } from './types'

export const createVertexCollectionIfNotExists = async <
  VertexDocumentType extends object,
  CollName extends string = string
>({
  name,
  createOpts,
  database: _db,
}: {
  database: Database | Promise<Database>
  name: CollName
  createOpts: CreateCollectionOptions
}) => {
  const db = await _db
  return db.collections().then(collections => {
    const found = collections.find(
      /* async */ collection => {
        // const props = await collection.properties()
        // const isDocumentCollection = props.type === CollectionType.DOCUMENT_COLLECTION
        return /*  isDocumentCollection && */ collection.name === name
      },
    ) as DocumentCollection<VertexDocumentType>
    return found || db.createCollection<VertexDocumentType>(name, createOpts)
  })
}

export const createEdgeCollectionIfNotExists = async <
  EdgeDocumentType extends object,
  CollName extends string = EdgeDocumentType extends { __typename: string } ? EdgeDocumentType['__typename'] : string
>({
  name,
  createOpts,
  database: _db,
}: {
  database: Database | Promise<Database>
  name: CollName
  createOpts: CreateCollectionOptions
}) => {
  const db = await _db
  return db.collections().then(collections => {
    const found = collections.find(
      /* async */ collection => {
        // const props = await collection.properties()
        // const isEdgeCollection = props.type === CollectionType.EDGE_COLLECTION
        return /*  isEdgeCollection && */ collection.name === name
      },
    ) as EdgeCollection<EdgeDocumentType>
    return found || db.createEdgeCollection<EdgeDocumentType>(name, createOpts)
  })
}

export const createDatabaseIfNotExists = ({
  dbConfig,
  name,
  dbCreateOpts,
}: {
  dbConfig: Config
  name: string
  dbCreateOpts: CreateDatabaseOptions
}) => {
  const db = new Database({ ...dbConfig })
  return db.databases().then(databases => {
    const found = databases.find(_db => _db.name === name)
    return found || db.createDatabase(name, dbCreateOpts)
  })
}

export const getDocumentById = async <Type extends object = object>({
  db,
  sel,
}: {
  db: Database
  sel: string | { _id: string }
}): Promise<Maybe<Type>> => {
  const _id = typeof sel == 'string' ? sel : sel._id
  const q = `RETURN DOCUMENT("${_id}")`
  const cursor = await db.query(q)
  const resp = await cursor.next()
  cursor.kill()
  return resp
}
