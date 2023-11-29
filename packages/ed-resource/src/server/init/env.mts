// @ts-ignore: because seems tsc won't read 'xbytes' declared typings :/
import { parseSize } from 'xbytes'
import { shell } from '../shell.mjs'

export const env = await getEnv()

type Env = {
  resourceUploadMaxSize: number
  enableMetaGenerator: boolean
}
function getEnv(): Env {
  const config: Env = {
    resourceUploadMaxSize: parseSize(shell.config.resourceUploadMaxSize),
    enableMetaGenerator: shell.config.enableMetaGenerator === true,
  }
  const env: Env = config
  console.log({ env })
  return env
}
