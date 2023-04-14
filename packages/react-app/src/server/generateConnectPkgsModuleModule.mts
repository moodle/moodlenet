import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { WebappPluginItem, WebPkgDeps } from '../common/types.mjs'
import { fixModuleLocForWebpackByOS } from './util.mjs'
function ___dirname(import_meta_url: string) {
  return fileURLToPath(new URL('.', import_meta_url))
}
const __dirname = ___dirname(import.meta.url)

export function generateConnectPkgModulesModule({
  plugins,
}: {
  plugins: WebappPluginItem<WebPkgDeps>[]
}) {
  return `// - generated ConnectPkgsModule for ${plugins.map(_ => _.guestPkgId.name).join(',')} -

  // import {pluginMainComponents} from '${fixModuleLocForWebpackByOS(
    resolve(__dirname, '..', 'src', 'webapp', 'mainContextProviders.tsx'),
  )}'
  // import {pluginMainComponents} from '${fixModuleLocForWebpackByOS(
    resolve(__dirname, '..', 'dist', 'webapp', 'mainContextProviders.js'),
  )}'

  ${plugins
    .map(
      (pluginItem, index) => `
import pkg_main_component_${index} from '${fixModuleLocForWebpackByOS(
        resolve(pluginItem.guestPkgInfo.pkgRootDir, ...pluginItem.mainComponentLoc),
      )}' // pkg: ${pluginItem.guestPkgId.name}
    `,
    )
    .join('')}

    const pkgs = []
    export default {
      pkgs
    }

  ${plugins
    .map(
      (pluginItem, index) => `


// connect ${pluginItem.guestPkgId.name} (pkg_main_component_${index})
  
  pkgs.push({
    //@ts-ignore
    MainComponent:pkg_main_component_${index},
    pkgId:Object.freeze(${JSON.stringify(pluginItem.guestPkgId)}),
    deps: ${JSON.stringify(
      Object.entries(pluginItem.deps).reduce(
        (_, [depName, { pkgId, rpc }]) => ({
          ..._,
          [depName]: {
            pkgId,
            rpcPaths: Object.keys(rpc),
          },
        }),
        {},
      ),
    )}
  })

`,
    )
    .join('')}
console.log('\\n--------- all pkgs connected ---------\\n\\n')
`
}
