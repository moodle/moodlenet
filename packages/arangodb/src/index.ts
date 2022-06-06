import type * as K from '@moodlenet/kernel'
import { Database } from 'arangojs'
import { Config } from 'arangojs/connection'
interface Instance {
  ensureDB(): Promise<{ db: Database; created: boolean }>
}

export type MNArangoDBExt = K.ExtDef<'moodlenet.arangodb', '0.1.10', {}, void, Instance>

const ext: K.Ext<MNArangoDBExt, [K.KernelExt]> = {
  id: 'moodlenet.arangodb@0.1.10',
  displayName: 'arangodb',
  requires: ['moodlenet.kernel@0.1.10'], //, 'moodlenet.sys-log@0.1.10'],
  enable(shell) {
    return {
      deploy(/* {  tearDown } */) {
        //const logger = console
        // const logger = coreExt.sysLog.moodlenetSysLogLib(shell)
        const env = getEnv(shell.env)
        const sysDB = new Database({ ...env.config })
        return {
          inst({ depl }) {
            return {
              async ensureDB() {
                const { extName } = shell.lib.splitExtId(depl.extId)
                const exists = (await sysDB.databases()).find(db => db.name === extName)

                const db = exists ?? (await sysDB.database(extName))

                return { db, created: !exists }
              },
            }
          },
        }
      },
    }
  },
}
export default [ext]

type Env = {
  config: Config
}
function getEnv(rawExtEnv: K.RawExtEnv): Env {
  console.log({ rawExtEnv })
  return rawExtEnv as any //FIXME: implement checks
}
