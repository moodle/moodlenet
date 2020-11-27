import { Database } from 'arangojs'
import { CollectionType, CreateCollectionOptions, DocumentCollection } from 'arangojs/collection'
import { Config } from 'arangojs/connection'
import { CreateDatabaseOptions } from 'arangojs/database'

export const createDocumentCollectionIfNotExists = async <DocType extends object>({
  name,
  createOpts,
  db: _db,
}: {
  db: Database | Promise<Database>
  name: string
  createOpts: CreateCollectionOptions
}) => {
  const db = await _db
  return db.collections().then((collections) => {
    const found = collections.find(
      async (collection) =>
        collection.name === name &&
        (await collection.properties()).type === CollectionType.DOCUMENT_COLLECTION
    ) as DocumentCollection<DocType>
    return found || db.createCollection<DocType>(name, createOpts)
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
