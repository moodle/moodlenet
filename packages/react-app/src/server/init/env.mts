// @ts-ignore: because seems tsc won't read 'xbytes' declared typings :/
import { parseSize } from 'xbytes'
import { shell } from '../shell.mjs'

export const env = getEnv()
type Env = {
  noWebappServer: boolean
  defaultImageUploadMaxSize: number
}
function getEnv(): Env {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = {
    defaultImageUploadMaxSize: parseSize(config.defaultImageUploadMaxSize ?? '3MB'),
    noWebappServer: !!(config.noWebappServer ?? false),
  }

  return env
}
