import type { CoreExt, Ext, ExtDef, InstallPkgReq, SubTopo } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { searchPackagesFromRegistry } from './lib'
import { SearchPackagesResObject, SearchPackagesResponse } from './types/data'

export type ExtensionsManagerExtTopo = {
  searchPackages: SubTopo<{ searchText: string; registry?: string }, SearchPackagesResponse>
}
export type ExtensionsManagerExt = ExtDef<'moodlenet-extensions-manager', '0.1.10', ExtensionsManagerExtTopo>

const ext: Ext<ExtensionsManagerExt, [CoreExt, ReactAppExt]> = {
  id: 'moodlenet-extensions-manager@0.1.10',
  displayName: 'Extensions manager',
  description: 'Manager for the application extensions',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10'],
  enable(shell) {
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      console.log(`moodlenet-extensions-manager: onExtInstance<ReactAppExt>`, inst)
      inst.setup({
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
        shell.lib.pubAll<ExtensionsManagerExt>('moodlenet-extensions-manager@0.1.10', shell, {
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
                  data: { extInfos: deployedList },
                },
              } /* ,
              {
                msg: {
                  data: { pkgInfos: installedPackages },
                },
              }, */,
            ] = await Promise.all([
              searchPackagesFromRegistry({ registry, searchText }),
              shell.lib.fetch<CoreExt>(shell)('moodlenet-core@0.1.10::ext/listDeployed')(),
              // shell.lib.fetch<CoreExt>(shell)('moodlenet-core@0.1.10::pkg/getInstalledPackages')(),
            ])
            const objects = searchRes.objects.map<SearchPackagesResObject>(
              ({ package: { name, description, keywords, version, links } }) => {
                // const isInstalled = !!installedPackages.find(pkgInfo => pkgInfo.packageJson.name === name)
                const installationFolder = deployedList
                  .map(({ packageInfo }) => packageInfo)
                  .find(packageInfo => packageInfo.packageJson.name === name)?.installationFolder
                const installPkgReq: InstallPkgReq = {
                  type: 'npm',
                  registry,
                  pkgId: version ? `${name}@${version}` : name,
                }
                return {
                  name,
                  description: description ?? '',
                  keywords: keywords ?? [],
                  version,
                  registry,
                  homepage: links?.homepage,
                  ...(installationFolder
                    ? { installPkgReq: undefined, installationFolder }
                    : { installationFolder: undefined, installPkgReq }),
                }
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

export default { exts: [ext] }
