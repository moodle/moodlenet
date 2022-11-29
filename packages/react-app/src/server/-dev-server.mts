import { watchFile } from 'fs'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { getWp } from './webpackWatch.mjs'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const port = Number(process.argv[2]) || 3000
const proxy = process.argv[3] || 'http://localhost:8080'
console.log({ port, proxy })
const _resolve_alias_json_filename = resolve(__dirname, '..', '..', '_resolve-alias_.json')
const _pkg_plugins_json_filename = resolve(__dirname, '..', '..', '_pkg_plugins_.json')
getAliases().then(async aliases => {
  const wp = getWp({
    mode: 'dev-server',
    baseResolveAlias: aliases,
    port,
    proxy,
    pkgPlugins: await getPkgPlugins(),
  })
  // console.log({ wpConfig })

  wp.watch({}, () => {
    console.log(`Webpack  watched`)
  })

  watchFile(_resolve_alias_json_filename, invalidate)
  // watchFile('_connect-moodlenet-pkg-modules_.ts', invalidate)

  async function invalidate() {
    const alias = await getAliases()
    if (!alias) {
      return
    }
    wp.options.resolve.alias = alias
    wp.watching.invalidate(() => {
      // console.log('INVALIDATED')
    })
  }
})

let lastAliasesString = ''
async function getAliases() {
  const newAliasesString = await readFile(_resolve_alias_json_filename, 'utf-8')
  if (newAliasesString === lastAliasesString) {
    return null
  }
  lastAliasesString = newAliasesString
  return JSON.parse(newAliasesString)
}

async function getPkgPlugins() {
  const newPkgPluginsString = await readFile(_pkg_plugins_json_filename, 'utf-8')
  return JSON.parse(newPkgPluginsString)
}
