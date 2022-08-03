import type { CoreExt, Ext, ExtDef, InstallPkgReq, SubTopo } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { searchPackagesFromRegistry } from './lib'
import { SearchPackagesResObject, SearchPackagesResponse } from './types/data'

export type ExtensionsManagerExtTopo = {
  searchPackages: SubTopo<{ searchText: string; registry?: string }, SearchPackagesResponse>
}
export type ExtensionsManagerExt = ExtDef<
  '@moodlenet/extensions-manager',
  '0.1.0',
  ExtensionsManagerExtTopo,
  void,
  void
>

const ext: Ext<ExtensionsManagerExt, [CoreExt, ReactAppExt]> = {
  name: '@moodlenet/extensions-manager',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0'],
  wireup(shell) {
    shell.plugin<ReactAppExt>('@moodlenet/react-app@0.1.0', plug => {
      console.log(`@moodlenet/extensions-manager: plugin<ReactAppExt>`, plug)
      plug.setup({
        // routes: {
        //   moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'ExtensionsRoutes.tsx'),
        //   rootPath: 'extensions/',
        // },
        ctxProvider: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'ExtensionsProvider.tsx'),
        },
      })
    })
    shell.expose({
      'searchPackages/sub': {
        validate() {
          return { valid: true }
        },
      },
    })
    return {
      deploy() {
        const coreAcccess = shell.access<CoreExt>('@moodlenet/core@0.1.0')
        shell.provide.services({
          async searchPackages({
            msg: {
              data: {
                req: { searchText, registry = getRegistry() },
              },
            },
          }) {
            console.log(`searchPackages in ${registry}`)
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
              coreAcccess.fetch('ext/listDeployed')(),
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
        return
      },
    }
  },
}
const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org/'
export const getRegistry = (_reg?: string | undefined) =>
  _reg ?? process.env.NPM_CONFIG_REGISTRY ?? DEFAULT_NPM_REGISTRY

export default ext
