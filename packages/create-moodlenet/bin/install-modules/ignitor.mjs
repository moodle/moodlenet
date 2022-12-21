import ignite from '@moodlenet/core/ignite'
import { readFile } from 'fs/promises'

const pkgJson = JSON.parse(await readFile('package.json', 'utf-8'))

const pkgConfigs = JSON.parse(await readFile('package.json', 'utf-8'))

await ignite({
  rootImport,
  pkgJson,
  pkgConfigs,
  reboot,
  shutdown,
})

process.send('ready')

function reboot() {
  process.send('reboot')
}
function shutdown() {
  process.send('shutdown')
}
function rootImport(mod) {
  return import(mod)
}
