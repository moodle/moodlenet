import { resolve } from 'path'
import { WebappPluginItem } from './types'
import { fixModuleLocForWebpackByOS } from './util'
export function generateConnectPkgModulesModule({ extPlugins }: { extPlugins: WebappPluginItem[] }) {
  return `// - generated ConnectPkgsModule for ${extPlugins.map(_ => _.guestShell.extId).join(',')} -

  import connectPkg from '${fixModuleLocForWebpackByOS(resolve(__dirname, '..', 'src', 'webapp', 'connectPkg'))}'

  ${extPlugins
    .reverse()
    .map(
      (extPluginItem, index) => `
import pkg_main_module_${index} from '${extPluginItem.mainModuleLoc}' // ${extPluginItem.guestShell.extId}
    `,
    )
    .join('')}

  ${extPlugins
    .reverse()
    .map(
      (extPluginItem, index) => `
// connect ${extPluginItem.guestShell.extId} (pkg_main_module_${index})
connectPkg({
  mainModule:pkg_main_module_${index},
  id: '${extPluginItem.guestShell.extId}',
  name: '${extPluginItem.guestShell.extName}',
  version: '${extPluginItem.guestShell.extVersion}',
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
