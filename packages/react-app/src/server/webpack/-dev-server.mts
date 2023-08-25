import { watchFile } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { getWp } from './config.mjs'
import { getBuildContext } from './get-build-context.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const baseBuildFolder = resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  '.dev-machines',
  String(process.argv[2]),
  'fs',
  '@moodlenet',
  'react-app',
  'webapp-build',
)
export const buildContext = getBuildContext({
  baseBuildFolder,
})

const port = 3000
const proxy = 'http://localhost:8080'
console.log('info', { port, proxy, _resolve_alias_json_filename: buildContext._resolve_alias_json })

let alias = await buildContext.getAliases()
const pkgPlugins = await buildContext.getPkgPlugins()

const wp = await getWp({
  alias,
  pkgPlugins,
  mode: 'dev-server',
  port,
  proxy,
})

watchFile(buildContext._resolve_alias_json, invalidate)
// watchFile('_connect-moodlenet-pkg-modules_.ts', invalidate)

async function invalidate() {
  const _alias = await buildContext.getAliases()
  if (alias === _alias) {
    return
  }
  alias = _alias
  wp.options.resolve.alias = alias
  wp.watching.invalidate(() => {
    // shell.log('debug', 'INVALIDATED')
  })
}
