import { CollectionMetadata } from 'arangojs/collection.js'
import arangojs from 'arangojs/index.js'
import assert from 'assert'
import {
  CollectionHandle,
  CollectionHandlesMap,
  CreateCollectionDef,
  CreateCollectionDefsMap,
  CreateCollectionOpts,
  CreateCollectionOptsMap,
} from '../types.mjs'
import { ensureDB } from './db.mjs'

export async function ensureCollections<Defs extends CreateCollectionDefsMap>(
  dbName: string,
  { defs }: { defs: CreateCollectionOptsMap<Defs> },
): Promise<CollectionHandlesMap<Defs>> {
  const { /* created, */ db } = await ensureDB(dbName)
  const checkAgainstCollectionMetadata = await db.listCollections(true)
  const collectionHandlesMap = await Object.keys(defs).reduce(async (_handlesP, collectionName) => {
    const def = defs[collectionName]
    assert(def)
    const currentCollectionHandle = await ensureCollection(dbName, collectionName, def, {
      checkAgainstCollectionMetadata,
    })
    return {
      ...(await _handlesP),
      [collectionName]: currentCollectionHandle,
    }
  }, Promise.resolve({}) as Promise<CollectionHandlesMap<Defs>>)

  return collectionHandlesMap
}

export async function ensureCollection<Def extends CreateCollectionDef>(
  dbName: string,
  collectionName: string,
  createOptsAndKind: CreateCollectionOpts<Def>,
  opts?: { checkAgainstCollectionMetadata?: CollectionMetadata[] },
): Promise<CollectionHandle<Def>> {
  type _DataType = Def['dataType']
  type _CollectionType = CollectionHandle<Def>['collection']
  const { kind, ...createOpts } = createOptsAndKind

  const { db } = await ensureDB(dbName)
  const collection = await getCollectionOrCreate()
  const collectionHandle: CollectionHandle<Def> = {
    collection,
  }
  return collectionHandle

  async function getCollectionOrCreate(): Promise<_CollectionType> {
    const currentCollections =
      opts?.checkAgainstCollectionMetadata ?? (await db.listCollections(true))
    const foundCollMeta = currentCollections.find(coll => coll.name === collectionName)
    if (foundCollMeta) {
      assert(
        (kind === 'edge' && foundCollMeta.type === arangojs.CollectionType.EDGE_COLLECTION) ||
          (kind === 'node' && foundCollMeta.type === arangojs.CollectionType.DOCUMENT_COLLECTION),
        `arango ensure collection type mismatch: found colleciton ${collectionName} of wrong kind (expected ${kind})`,
      )
      const collection = db.collection<_DataType>(collectionName)

      return collection
    }

    const collection =
      kind === 'edge'
        ? await db.createEdgeCollection<_DataType>(collectionName, createOpts)
        : await db.createCollection<_DataType>(collectionName, createOpts)

    return collection as _CollectionType
  }
}
