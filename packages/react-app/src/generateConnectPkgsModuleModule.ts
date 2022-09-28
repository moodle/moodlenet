import { resolve } from 'path'
import { WebappPluginItem } from './types'
import { fixModuleLocForWebpackByOS } from './util'
export function generateConnectPkgModulesModule({ extPlugins }: { extPlugins: WebappPluginItem[] }) {
  // const reversedExtPlugins = extPlugins.slice().reverse()

  return `// - generated ConnectPkgsModule for ${extPlugins.map(_ => _.guestShell.extId).join(',')} -

  //@ts-ignore
  import connectPkg from 'file:${fixModuleLocForWebpackByOS(
    resolve(__dirname, '..', 'src', 'webapp', 'connectPkg.ts'),
  )}'

  ${extPlugins
    .map(
      (extPluginItem, index) => `
import pkg_main_module_${index} from 'file:${extPluginItem.mainModuleLoc}' // ${extPluginItem.guestShell.extId}
    `,
    )
    .join('')}

  ${extPlugins
    .map(
      (extPluginItem, index) => `


// connect ${extPluginItem.guestShell.extId} (pkg_main_module_${index})
connectPkg({
  //@ts-ignore
  mainModule:pkg_main_module_${index},
  pkg:{
    id: '${extPluginItem.guestShell.extId}',
    name: '${extPluginItem.guestShell.extName}',
    version: '${extPluginItem.guestShell.extVersion}',
  },
  requires: [
    ${extPluginItem.guestShell.requires.map(_ => JSON.stringify(_, null, 2)).join(',\n')}
  ]
})

`,
    )
    .join('')}
console.log('\\n--------- all pkgs connected ---------\\n\\n')
`
}
