// @ts-ignore: because seems tsc won't read 'xbytes' declared typings :/
import { parseSize } from 'xbytes'
import { shell } from '../shell.mjs'

export const env = await getEnv()

type Env = {
  port: number
  defaultRpcUploadMaxSize: number
  // secure?: SecureHttpConfig
}
function getEnv(): Env {
  const config: Env = {
    port: shell.config.port,
    defaultRpcUploadMaxSize: parseSize(shell.config.defaultRpcUploadMaxSize),
  }
  //FIXME: validate configs
  const env: Env = config
  return env
}
