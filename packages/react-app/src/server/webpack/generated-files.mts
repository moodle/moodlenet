import { mkdir, readFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import type { WebappPluginItem } from '../../common/types.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const _resolve_alias_json_filename = resolve(
  __dirname,
  '..',
  '..',
  '..',
  '_resolve-alias_.json',
)
export const _pkg_plugins_json_filename = resolve(__dirname, '..', '..', '..', '_pkg_plugins_.json')
let lastAliasesString = ''
export async function getAliases() {
  const newAliasesString = await readFile(_resolve_alias_json_filename, 'utf-8')
  if (newAliasesString === lastAliasesString) {
    return null
  }
  lastAliasesString = newAliasesString
  return JSON.parse(newAliasesString)
}

export async function getPkgPlugins(): Promise<WebappPluginItem<any>[]> {
  const newPkgPluginsString = await readFile(_pkg_plugins_json_filename, 'utf-8')
  return JSON.parse(newPkgPluginsString)
}

export const buildFolder = resolve(__dirname, '..', '..', '..', 'build')
await mkdir(buildFolder, { recursive: true })
export const latestBuildFolder = resolve(__dirname, '..', '..', '..', 'latest-build')
