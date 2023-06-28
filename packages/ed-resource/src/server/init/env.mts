// @ts-ignore: because seems tsc won't read 'xbytes' declared typings :/
import { parseSize } from 'xbytes'
import { shell } from '../shell.mjs'

export const env = await getEnv()
console.log('ENV:', env)

type Env = {
  resourceUploadMaxSize: number
}
function getEnv(): Env {
  const config: Env = {
    resourceUploadMaxSize: parseSize(shell.config.resourceUploadMaxSize),
  }
  const env: Env = config
  return env
}
