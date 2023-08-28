import { readFile } from 'fs/promises'
import { resolve } from 'path'
import type { WebappPluginItem } from '../../common/types.mjs'

export function getBuildContext({ baseBuildFolder }: { baseBuildFolder: string }) {
  const connectPkgModulesFileTarget = resolve(
    baseBuildFolder,
    '_connect-moodlenet-pkg-modules_.mjs',
  )
  const _resolve_alias_json = resolve(baseBuildFolder, '_resolve-alias_.json')
  const _pkg_plugins_json = resolve(baseBuildFolder, '_pkg_plugins_.json')
  // const buildFolder = resolve(baseBuildFolder, 'build')
  const latestBuildFolder = resolve(baseBuildFolder, 'latest-build')

  return {
    getAliases,
    getPkgPlugins,
    baseBuildFolder,
    connectPkgModulesFileTarget,
    _resolve_alias_json,
    _pkg_plugins_json,
    // buildFolder,
    latestBuildFolder,
  }

  async function getAliases(): Promise<any> {
    const newAliasesString = await readFile(_resolve_alias_json, 'utf-8')
    return JSON.parse(newAliasesString)
  }

  async function getPkgPlugins(): Promise<WebappPluginItem<any>[]> {
    const newPkgPluginsString = await readFile(_pkg_plugins_json, 'utf-8')
    return JSON.parse(newPkgPluginsString)
  }
}
