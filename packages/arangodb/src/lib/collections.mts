import arangojs from 'arangojs/index.js'
import assert from 'assert'
import { CollectionDef, CollectionDefOptMap, CollectionHandle } from '../types.mjs'
import { ensureDB, sysDB } from './db.mjs'

export async function ensure(dbName: string, { defs }: { defs: CollectionDefOptMap }) {
  const { /* created, */ db } = await ensureDB(dbName)
  const currentCollections = await db.listCollections(true)
  const collections = await Promise.all(
    Object.keys(defs).map(async collectionName => {
      const { kind, opts } = defs[collectionName]!
      const isEdge = kind === 'edge'
      const foundColl = currentCollections.find(coll => coll.name === collectionName)
      if (foundColl) {
        assert(
          (isEdge && foundColl.type === arangojs.CollectionType.EDGE_COLLECTION) ||
            (!isEdge && foundColl.type === arangojs.CollectionType.DOCUMENT_COLLECTION),
          `arango ensure collection type mismatch: found colleciton ${collectionName} of wrong kind (expected ${kind})`,
        )
        // if exists assume indexes are the same as first time, expecting a dropIndexes and re-ensureIndexes during package upgrade
        // FIXME: however, it would be great finding a dynamic solution : remove and add named indexes
        return db.collection(collectionName)
      }
      const collection = await (isEdge
        ? db.createEdgeCollection(collectionName, {})
        : db.createCollection(collectionName, {}))

      await Promise.all(
        (opts?.indexes ?? []).map(indexDef => collection.ensureIndex(indexDef as any)),
      )
      return collection
    }),
  )
  const collectionHandlesMap = collections.reduce((_res, collection) => {
    const handle: CollectionHandle<CollectionDef<any>> = { collection }
    return { ..._res, [handle.collection.name]: handle }
  }, {} as any)
  return collectionHandlesMap
}

export async function list(dbName: string) {
  const db = sysDB.database(dbName)
  const collectionsMeta = (await db.listCollections(true)).filter(
    coll => coll.type === arangojs.CollectionType.DOCUMENT_COLLECTION,
  )
  return { collectionsMeta }
}

export async function drop(dbName: string, { collectionName }: { collectionName: string }) {
  const db = sysDB.database(dbName)
  return db
    .collection(collectionName)
    .drop({ isSystem: false })
    .then(
      _ => true,
      () => false,
    )
}
