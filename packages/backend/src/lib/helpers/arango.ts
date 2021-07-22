import { IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { CreateCollectionOptions, DocumentCollection, EdgeCollection } from 'arangojs/collection'
import { Config } from 'arangojs/connection'
import { CreateDatabaseOptions } from 'arangojs/database'
import promiseRetry, { PromiseRetryOpts } from 'promise-retry'
import { ulid } from 'ulid'
import { Maybe } from './types'

export const createVertexCollectionIfNotExists = async <
  VertexDocumentType extends object,
  CollName extends string = string,
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
  CollName extends string = EdgeDocumentType extends { __typename: string } ? EdgeDocumentType['__typename'] : string,
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

export const aqlstr = (_: any) => JSON.stringify(_)

export const newGlyphKey = (): IdKey => ulid()

export const getOneResult = async (q: string, db: Database) => {
  const cursor = await db.query(q)
  const result = await cursor.next()
  // console.log({ getOneResult: q, result })
  cursor.kill()
  return result
}

export const getAllResults = async (q: string, db: Database) => {
  const cursor = await db.query(q)
  const results = await cursor.all()
  cursor.kill()
  return results
}

export const justExecute = async (q: string, db: Database) => {
  const cursor = await db.query(q)
  cursor.kill()
  const { count, extra } = cursor
  return {
    count,
    extra,
  }
}

// TODO: hook this in helper funcs
export const queryRetry = async (q: string, db: Database, opts?: Partial<PromiseRetryOpts>) =>
  promiseRetry(
    retry => db.query(q).catch(err => (String(err?.errorNum) === '1200' ? retry(err) : Promise.reject(err))),
    opts,
  )
