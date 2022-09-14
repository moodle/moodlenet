import type { CoreExt, Ext, ExtId, ExtName, RawExtEnv } from '@moodlenet/core'
import * as arango from 'arangojs'
import { Database } from 'arangojs'
import { Config } from 'arangojs/connection'
import assert from 'assert'
import { CollectionDef, CollectionHandle, Instance, MNArangoDBExt, QueryReq } from './types'

export * from './types'

const ext: Ext<MNArangoDBExt, [CoreExt]> = {
  name: '@moodlenet/arangodb',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0'], //, '@moodlenet/sys-log@0.1.0'],
  connect(shell) {
    return {
      deploy() {
        //const logger = console
        // const logger = coreExt.sysLog.moodlenetSysLogLib(shell)
        const env = getEnv(shell.env)
        const sysDB = new Database({ ...env.connectionCfg })

        shell.onExtUninstalled(async ({ extName }) => {
          const extDBName = getExtDBName(extName)
          const exists = await sysDB.database(extDBName).exists()
          if (exists) {
            sysDB.dropDatabase(extDBName)
          }
        })
        shell.provide.services({
          async query(qReq, { source }) {
            const instance = instanceFor(source)
            return instance.query(qReq)
          },
          async ensureCollections({ defs }, { source }) {
            const instance = instanceFor(source)
            await instance.ensureCollections({ defs })
            return
          },
        })

        return {
          plug: ({ shell }) => instanceFor(shell.extId),
        }

        /*
         * impl
         */
        function instanceFor(forExtId: ExtId): Instance {
          const { extName } = shell.lib.splitExtId(forExtId)
          const extDBName = getExtDBName(extName)
          const instance: Instance = {
            arango,
            async ensureCollections({ defs }) {
              const { /* created, */ db } = await ensureDB()
              const currentCollections = await db.listCollections(true)
              const collections = await Promise.all(
                Object.keys(defs).map(async collectionName => {
                  const { kind, opts } = defs[collectionName]!
                  const isEdge = kind === 'edge'
                  const foundColl = currentCollections.find(coll => coll.name === collectionName)
                  if (foundColl) {
                    assert(
                      (isEdge && foundColl.type === arango.CollectionType.EDGE_COLLECTION) ||
                        (!isEdge && foundColl.type === arango.CollectionType.DOCUMENT_COLLECTION),
                      `arango ensure collection type mismatch: found colleciton ${collectionName} of wrong kind (expected ${kind})`,
                    )
                    // if exists assume indexes are the same as first time, expecting a dropIndexes and re-ensureIndexes during package upgrade
                    // FIXME: however, it would be great finding a dynamic solution : remove and add named indexes
                    return db.collection(collectionName)
                  }
                  const collection = await (isEdge
                    ? db.createEdgeCollection(collectionName, {})
                    : db.createCollection(collectionName, {}))

                  await Promise.all((opts?.indexes ?? []).map(indexDef => collection.ensureIndex(indexDef as any)))
                  return collection
                }),
              )
              const collectionHandlesMap = collections.reduce((_res, collection) => {
                const handle: CollectionHandle<CollectionDef<any>> = { collection }
                return { ..._res, [handle.collection.name]: handle }
              }, {} as any)
              return collectionHandlesMap
            },
            async query({ q, bindVars, opts }: QueryReq) {
              const db = sysDB.database(extDBName)
              const qcursor = await db.query(q, bindVars, opts).catch(e => {
                const msg = `arango query error: q:${q} bindVars:${JSON.stringify(bindVars)} opts:${JSON.stringify(
                  opts,
                )}\nerror:${String(e)}`
                console.error(msg)
                throw new Error(msg, { cause: e })
              })
              const resultSet = await qcursor.all()
              return { resultSet }
            },
            async collections() {
              const db = sysDB.database(extDBName)
              const collectionsMeta = (await db.listCollections(true)).filter(
                coll => coll.type === arango.CollectionType.DOCUMENT_COLLECTION,
              )
              return { collectionsMeta }
            },

            async dropCollection({ name }) {
              const db = sysDB.database(extDBName)
              return db
                .collection(name)
                .drop({ isSystem: false })
                .then(
                  _ => true,
                  () => false,
                )
            },
          }
          return instance
          async function ensureDB() {
            const exists = (await sysDB.databases()).find(db => db.name === extDBName)
            const db = exists ?? (await sysDB.createDatabase(extDBName))
            return { created: !exists, db }
          }
        }
      },
    }
  },
}
export default ext

function getExtDBName(extName: ExtName) {
  return extName[0] === '@' ? extName.replace('@', 'at__').replace('/', '__') : extName
}

type Env = {
  connectionCfg: Config
}
function getEnv(rawExtEnv: RawExtEnv): Env {
  //FIXME: implement checks
  const env: Env = {
    ...rawExtEnv,
  }
  return env
}
