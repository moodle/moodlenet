import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { WebappPluginItem } from './types.mjs'
import { fixModuleLocForWebpackByOS } from './util.mjs'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export function generateConnectPkgModulesModule({ plugins }: { plugins: WebappPluginItem[] }) {
  // const reversedExtPlugins = extPlugins.slice().reverse()

  return `// - generated ConnectPkgsModule for ${plugins.map(_ => _.guestPkgId.name).join(',')} -

  //@ts-ignore
  //import {pluginMainComponents} from '${fixModuleLocForWebpackByOS(
    resolve(__dirname, '..', 'src', 'webapp', 'mainContextProviders.tsx'),
  )}'
 import {pluginMainComponents} from '${fixModuleLocForWebpackByOS(
   resolve(__dirname, '..', 'lib', 'webapp', 'mainContextProviders.js'),
 )}'

  ${plugins
    .map(
      (pluginItem, index) => `
import pkg_main_component_${index} from '${pluginItem.mainComponentLoc}' // ${pluginItem.guestPkgId.name}
    `,
    )
    .join('')}

  ${plugins
    .map(
      (pluginItem, index) => `


// connect ${pluginItem.guestPkgId.name} (pkg_main_component_${index})
pluginMainComponents.push({
  //@ts-ignore
  MainComponent:pkg_main_component_${index},
  pkgId:${JSON.stringify(pluginItem.guestPkgId)},
  usesPkgs: ${JSON.stringify(pluginItem.usesPkgs.map(({ pkgId }) => ({ pkgId })))}
})

`,
    )
    .join('')}
console.log('\\n--------- all pkgs connected ---------\\n\\n')
`
}
