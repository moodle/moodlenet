import type { CoreExt, Ext, ExtDef, ExtId, ExtName, RawExtEnv, SubTopo } from '@moodlenet/core'
import * as arango from 'arangojs'
import { Database } from 'arangojs'
import { Config, Dict } from 'arangojs/connection'
import { QueryOptions } from 'arangojs/database'
type CollectionDef = { name: string }

type QueryReq = { q: string; opts?: QueryOptions; bindVars?: Dict<any> }
type QueryRes = { resultSet: any[] }
interface Instance {
  arango: typeof arango
  // ensureDocumentCollections(_: CollectionDef[]): Promise<void>
}
type Routes = {
  ensureDocumentCollections: SubTopo<{ defs: CollectionDef[] }, void>
  query: SubTopo<QueryReq, QueryRes>
}
export type MNArangoDBExt = ExtDef<'@moodlenet/arangodb', '0.1.0', Instance, Routes>

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
            const helpers = getDBHelpers(source)
            return helpers.query(qReq)
          },
          async ensureDocumentCollections({ defs }, { source }) {
            const helpers = getDBHelpers(source)
            await helpers.ensureDocumentCollections(defs)
          },
        })
        return {
          plug(/* { shell } */) {
            // const helpers = getDBHelpers(shell.extId)
            return {
              arango,
              // async ensureDocumentCollections(defs) {
              //   // TODO: remove ?
              //   await helpers.ensureDocumentCollections(defs)
              //   return
              // },
            }
          },
        }
        function getDBHelpers(forExtId: ExtId) {
          const { extName } = shell.lib.splitExtId(forExtId)
          const extDBName = getExtDBName(extName)
          return {
            async ensureDocumentCollections(defs: CollectionDef[]) {
              const { /* created, */ db } = await ensureDB()
              const collectionNames = (await db.collections()).map(({ name }) => name)
              await Promise.all(
                defs
                  .filter(({ name }) => !collectionNames.includes(name))
                  .map(({ name }) => {
                    db.createCollection(name)
                  }),
              )
              return
            },
            async query({ q, bindVars, opts }: QueryReq): Promise<QueryRes> {
              const db = sysDB.database(extDBName)
              const qcursor = await db.query(q, bindVars, opts).catch(e => {
                const msg = 'arango query error'
                const cause = {
                  error: String(e),
                  q,
                  bindVars,
                  opts,
                }
                console.error({ msg, cause })
                throw new Error(msg, { cause })
              })
              const resultSet = await qcursor.all()
              return { resultSet }
            },
          }
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
  console.log({ rawExtEnv })
  const env: Env = {
    ...rawExtEnv,
  }
  return env
}
