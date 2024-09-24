import { resolve } from 'path'
// @ts-ignore because seems tsc won't read 'xbytes' declared typings :/
import { parseSize } from 'xbytes'
import { shell } from '../shell.mjs'

export const env = getEnv()
type Env = {
  noWebappServer: boolean
  defaultImageUploadMaxSize: number
  baseBuildFolder: string
  noWebappBuilder: boolean
}
function getEnv(): Env {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = {
    defaultImageUploadMaxSize: parseSize(config.defaultImageUploadMaxSize ?? '3MB'),
    noWebappServer: !!(config.noWebappServer ?? false),
    baseBuildFolder: config.baseBuildFolder ?? resolve(shell.baseFsFolder, 'webapp-build'),
    noWebappBuilder: !!config.noWebappBuilder,
  }

  return env
}
