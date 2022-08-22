import type { CoreExt, Ext, ExtId, ExtName, RawExtEnv } from '@moodlenet/core'
import * as arango from 'arangojs'
import { Database } from 'arangojs'
import { DocumentCollection } from 'arangojs/collection'
import { Config } from 'arangojs/connection'
import * as IndexeTypes from 'arangojs/indexes'
import { Instance, MNArangoDBExt, QueryReq, QueryRes } from './types'

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

        shell.onExtUninstalled(({ extName }) => {
          const extDBName = getExtDBName(extName)
          sysDB.dropDatabase(extDBName)
        })
        shell.provide.services({
          async query(qReq, { source }) {
            const instance = instanceFor(source)
            return instance.query(qReq)
          },
          async ensureDocumentCollections({ defs }, { source }) {
            const instance = instanceFor(source)
            await instance.ensureDocumentCollections({ defs })
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
            async ensureDocumentCollections({ defs }) {
              const { /* created, */ db } = await ensureDB()
              const currentCollections = (await db.listCollections(true)).filter(
                coll => coll.type === arango.CollectionType.DOCUMENT_COLLECTION,
              )
              const _def_entries = Object.entries(defs)
              const docCollections = await Promise.all(
                _def_entries.map(async ([collectionName, [type, opts]]) => {
                  const exists = !!currentCollections.find(coll => coll.name === collectionName)
                  if (exists) {
                    // if exists assume indexes are the same as first time,
                    // expecting a dropIndexes and re-ensureIndexes during package upgrade
                    return db.collection(collectionName) as DocumentCollection
                  }
                  const collection = await db.createCollection(collectionName, {
                    type: arango.CollectionType.DOCUMENT_COLLECTION,
                  })
                  await Promise.all(indexes.map(indexDef => collection.ensureIndex(indexDef as any)))
                  return collection
                }),
              )
              const collectionsMap = docCollections.reduce<{
                [collectionName in keyof typeof defs]: DocumentCollection<any>
              }>((_res, collection) => ({ ..._res, [collection.name]: collection }), {} as any)
              return collectionsMap
            },
            async query({ q, bindVars, opts }: QueryReq): Promise<QueryRes> {
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

export type IndexDefType = { name: string } & (
  | IndexeTypes.EnsurePersistentIndexOptions
  | IndexeTypes.EnsureTtlIndexOptions
  | IndexeTypes.EnsureZkdIndexOptions
  | IndexeTypes.EnsureFulltextIndexOptions
  | IndexeTypes.EnsureGeoIndexOptions
)
