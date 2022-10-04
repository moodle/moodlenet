import { Config } from 'arangojs/connection.js'

export const env = getEnv(null)

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
