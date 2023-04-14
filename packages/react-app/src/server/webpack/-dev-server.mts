import { watchFile } from 'fs'
import { getWp } from './config.mjs'
import { getAliases, _resolve_alias_json_filename } from './generated-files.mjs'

const port = 3000
const proxy = 'http://localhost:8080'
console.log({ port, proxy, _resolve_alias_json_filename })

const wp = await getWp({
  mode: 'dev-server',
  port,
  proxy,
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
