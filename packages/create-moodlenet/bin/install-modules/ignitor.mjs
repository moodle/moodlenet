import 'dotenv-expand/config'
import ignite from '@moodlenet/core/ignite'
import { readFile } from 'fs/promises'
import { createRequire } from 'module'
import { resolve } from 'path'

const rootPkgJson = JSON.parse(await readFile('package.json', 'utf-8'))

const configsFilename = process.env.MOODLENET_CONFIG_FILE ?? 'default.config.json'
const configs = JSON.parse(await readFile(configsFilename, 'utf-8'))
const rootDir = process.cwd()
const rootRequire = createRequire(resolve(rootDir, 'node_modules'))

await ignite({
  rootDir,
  rootRequire,
  rootImport,
  rootPkgJson,
  reboot,
  shutdown,
  configs,
})

process.send?.('ready')

function reboot() {
  process.send?.('reboot')
}
function shutdown() {
  process.send?.('shutdown')
}
function rootImport(mod) {
  return import(mod)
}
