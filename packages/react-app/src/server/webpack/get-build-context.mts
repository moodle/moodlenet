import { readFile } from 'fs/promises'
import { createRequire } from 'module'
import { resolve } from 'path'
import { packageDirectorySync } from 'pkg-dir'
import type { WebappPluginItem } from '../../common/types.mjs'

const require = createRequire(import.meta.url)

export function getBuildContext({ baseBuildFolder }: { baseBuildFolder: string }) {
  const connectPkgModulesFileTarget = resolve(
    baseBuildFolder,
    '_connect-moodlenet-pkg-modules_.mjs',
  )
  const _resolve_alias_json = resolve(baseBuildFolder, '_resolve-alias_.json')
  const _pkg_plugins_json = resolve(baseBuildFolder, '_pkg_plugins_.json')
  const latestBuildFolder = resolve(baseBuildFolder, 'latest-build')

  return {
    getAliases,
    getPkgPlugins,
    baseBuildFolder,
    connectPkgModulesFileTarget,
    _resolve_alias_json,
    _pkg_plugins_json,
    latestBuildFolder,
  }

  async function getAliases(): Promise<any> {
    const newAliasesString = await readFile(_resolve_alias_json, 'utf-8')
    const aliases = {
      ...JSON.parse(newAliasesString),
      'react': packageDirectorySync({ cwd: require.resolve('react') })!,
      'react-router-dom': packageDirectorySync({ cwd: require.resolve('react-router-dom') })!,
      'react-dom': packageDirectorySync({ cwd: require.resolve('react-dom') })!,
      '@emotion/react': packageDirectorySync({ cwd: require.resolve('@emotion/react') })!,
      '@emotion/styled': packageDirectorySync({ cwd: require.resolve('@emotion/styled') })!,
      '@mui/icons-material': packageDirectorySync({ cwd: require.resolve('@mui/icons-material') })!,
      '@mui/material': packageDirectorySync({ cwd: require.resolve('@mui/material') })!,
    }
    return aliases
  }

  async function getPkgPlugins(): Promise<WebappPluginItem<any>[]> {
    const newPkgPluginsString = await readFile(_pkg_plugins_json, 'utf-8')
    return JSON.parse(newPkgPluginsString)
  }
}
