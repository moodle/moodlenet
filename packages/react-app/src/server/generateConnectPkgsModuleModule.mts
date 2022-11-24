import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { WebappPluginItem } from '../common/types.mjs'
import { fixModuleLocForWebpackByOS } from './util.mjs'
import { WebPkgDepList } from '../webapp/web-lib.mjs'
function ___dirname(import_meta_url: string) {
  return fileURLToPath(new URL('.', import_meta_url))
}
const __dirname = ___dirname(import.meta.url)

export function generateConnectPkgModulesModule({
  plugins,
}: {
  plugins: WebappPluginItem<WebPkgDepList>[]
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
import pkg_main_component_${index} from '${resolve(
        pluginItem.guestPkgInfo.pkgRootDir,
        ...pluginItem.mainComponentLoc,
      )}' // ${pluginItem.guestPkgId.name}
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
    usesPkgs: ${JSON.stringify(pluginItem.usesPkgs)}
  })

`,
    )
    .join('')}
console.log('\\n--------- all pkgs connected ---------\\n\\n')
`
}
