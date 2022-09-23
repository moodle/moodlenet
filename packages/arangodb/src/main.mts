import { connect } from '@moodlenet/core'
import { Database } from 'arangojs'
import { Config } from 'arangojs/connection.js'
import apis from './apis.mjs'
export * from './types.mjs'
const connection = await connect(import.meta, apis)
export default connection

const env = getEnv(null)

export const sysDB = new Database({ ...env.connectionCfg })

// shell.onExtUninstalled(async ({ extName }) => {
//   const extDBName = getExtDBName(extName)
//   const exists = await sysDB.database(extDBName).exists()
//   if (exists) {
//     sysDB.dropDatabase(extDBName)
//   }
// })

type Env = {
  connectionCfg: Config
}
function getEnv(rawExtEnv: any): Env {
  //FIXME: implement checks
  const env: Env = {
    ...rawExtEnv,
  }
  return env
}
