import { Database } from 'arangojs'
import {
  CreateCollectionOptions,
  DocumentCollection,
  EdgeCollection,
} from 'arangojs/collection'
import { Config } from 'arangojs/connection'
import { CreateDatabaseOptions } from 'arangojs/database'

export const createDocumentCollectionIfNotExists = async <
  DocType extends object,
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
  return db.collections().then((collections) => {
    const found = collections.find(
      /* async */ (collection) => {
        // const props = await collection.properties()
        // const isDocumentCollection = props.type === CollectionType.DOCUMENT_COLLECTION
        return /*  isDocumentCollection && */ collection.name === name
      }
    ) as DocumentCollection<DocType>
    return found || db.createCollection<DocType>(name, createOpts)
  })
}

export const createEdgeCollectionIfNotExists = async <
  EdgeType extends object,
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
  return db.collections().then((collections) => {
    const found = collections.find(
      /* async */ (collection) => {
        // const props = await collection.properties()
        // const isEdgeCollection = props.type === CollectionType.EDGE_COLLECTION
        return /*  isEdgeCollection && */ collection.name === name
      }
    ) as EdgeCollection<EdgeType>
    return found || db.createEdgeCollection<EdgeType>(name, createOpts)
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
  return db.databases().then((databases) => {
    const found = databases.find((_db) => _db.name === name)
    return found || db.createDatabase(name, dbCreateOpts)
  })
}
