import type { CoreExt, Ext, ExtDef, ExtName, RawExtEnv, SubTopo } from '@moodlenet/core'
import * as arango from 'arangojs'
import { Database } from 'arangojs'
import { Config, Dict } from 'arangojs/connection'
import { QueryOptions } from 'arangojs/database'

interface Instance {
  arango: typeof arango
  install(): Promise<{ db: Database; created: boolean }>
}
type Routes = {
  query: SubTopo<{ q: string; opts?: QueryOptions; bindVars?: Dict<any> }, { resultSet: any[] }>
}
export type MNArangoDBExt = ExtDef<'@moodlenet/arangodb', '0.1.0', Routes, void, Instance>

const ext: Ext<MNArangoDBExt, [CoreExt]> = {
  name: '@moodlenet/arangodb',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0'], //, '@moodlenet/sys-log@0.1.0'],
  deploy(shell) {
    //const logger = console
    // const logger = coreExt.sysLog.moodlenetSysLogLib(shell)
    const env = getEnv(shell.env)
    const sysDB = new Database({ ...env.config })
    shell.onExtUninstalled(({ extName }) => {
      const extDBName = getExtDBName(extName)
      sysDB.dropDatabase(extDBName)
    })
    shell.provide.services({
      async query({
        msg: {
          source,
          data: {
            req: { q, bindVars, opts },
          },
        },
      }) {
        const { extName } = shell.lib.splitExtId(source)
        const db = sysDB.database(getExtDBName(extName))
        const qcursor = await db.query(q, bindVars, opts)
        const resultSet = await qcursor.all()
        return { resultSet }
      },
    })
    return {
      plug({ depl }) {
        return {
          arango,
          async install() {
            const extDBName = getExtDBName(depl.shell.extName)
            const exists = (await sysDB.databases()).find(db => db.name === extDBName)
            const db = exists ?? (await sysDB.createDatabase(extDBName))
            return { db, created: !exists }
          },
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
  config: Config
}
function getEnv(rawExtEnv: RawExtEnv): Env {
  //FIXME: implement checks
  console.log({ rawExtEnv })
  const env: Env = {
    ...rawExtEnv,
  }
  return env
}
