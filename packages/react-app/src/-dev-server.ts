import { watchFile } from 'fs'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { getWp } from './webpackWatch'

const port = Number(process.argv[2]) || 3000
const proxy = process.argv[3] || 'http://localhost:8080'
console.log({ port, proxy })
const _resolve_alias_json_filename = resolve(__dirname, '..', '_resolve-alias_.json')
getAliases().then(aliases => {
  const wp = getWp({
    mode: 'dev-server',
    baseResolveAlias: aliases,
    port,
    proxy,
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
