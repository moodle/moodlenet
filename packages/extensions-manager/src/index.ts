import type { CoreExt, Ext, ExtDef, InstallPkgReq, SubTopo } from '@moodlenet/core'
import type { ReactAppExtDef } from '@moodlenet/react-app'
import { resolve } from 'path'
import { searchPackagesFromRegistry } from './lib'
import { SearchPackagesResObject, SearchPackagesResponse } from './types/data'

export type ExtensionsManagerExtTopo = {
  searchPackages: SubTopo<{ searchText: string; registry?: string }, SearchPackagesResponse>
}
export type ExtensionsManagerExtDef = ExtDef<'@moodlenet/extensions-manager', '0.1.0', void, ExtensionsManagerExtTopo>

export type ExtensionsManagerExt = Ext<ExtensionsManagerExtDef, [CoreExt, ReactAppExtDef]>
const ext: ExtensionsManagerExt = {
  name: '@moodlenet/extensions-manager',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0'],
  connect(shell) {
    const [core, reactApp] = shell.deps
    return {
      deploy() {
        reactApp.plug.setup({
          mainModuleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainModule.tsx'),
        })

        shell.expose({
          'searchPackages/sub': {
            validate() {
              return { valid: true }
            },
          },
        })
        shell.provide.services({
          async searchPackages({ searchText, registry = getRegistry() }) {
            const [
              searchRes,
              {
                msg: {
                  data: { pkgInfos },
                },
              } /* ,
              {
                msg: {
                  data: { pkgInfos: installedPackages },
                },
              }, */,
            ] = await Promise.all([
              searchPackagesFromRegistry({ registry, searchText: `moodlenet ${searchText}` }),
              core.access.fetch('ext/listDeployed')(),
              // shell.lib.fetch<CoreExt>(shell)('@moodlenet/core@0.1.0::pkg/getInstalledPackages')(),
            ])
            const objects = searchRes.objects.map(
              ({ package: { name: pkgName, description, keywords, version, links } }) => {
                // const isInstalled = !!installedPackages.find(pkgInfo => pkgInfo.packageJson.name === name)
                const pkgInstallationId = pkgInfos
                  //.map(({ packageInfo }) => packageInfo)
                  .find(packageInfo => packageInfo.packageJson.name === pkgName)?.id
                const installPkgReq: InstallPkgReq = {
                  type: 'npm',
                  registry,
                  pkgId: version ? `${pkgName}@${version}` : pkgName,
                }
                const objects: SearchPackagesResObject = {
                  pkgName,
                  description: description ?? '',
                  keywords: keywords ?? [],
                  version,
                  registry,
                  homepage: links?.homepage,
                  ...(pkgInstallationId ? { installed: true, pkgInstallationId } : { installed: false, installPkgReq }),
                }
                return objects
              },
            )
            return { objects }
          },
        })
        return {}
      },
    }
  },
}
const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org/'
export const getRegistry = (_reg?: string | undefined) =>
  _reg ?? process.env.NPM_CONFIG_REGISTRY ?? DEFAULT_NPM_REGISTRY

export default ext
