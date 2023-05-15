import { resolve } from 'path'
import type { WebappPluginItem, WebPkgDeps } from '../common/types.mjs'
import { shell } from './shell.mjs'
import { fixModuleLocForWebpackByOS } from './util.mjs'

export function generateConnectPkgModulesModule({
  plugins,
}: {
  plugins: WebappPluginItem<WebPkgDeps>[]
}) {
  const pkgDepOrder = shell.pkgDepGraph.overallOrder()
  const sortedPlugins = plugins.slice().sort(({ guestPkgId: a }, { guestPkgId: b }) => {
    const aindex = pkgDepOrder.findIndex(pkgName => pkgName === a.name)
    const bindex = pkgDepOrder.findIndex(pkgName => pkgName === b.name)
    return aindex - bindex
  })
  return `
  export default [
    ${sortedPlugins
      .map(pluginItem => {
        const importInitModule = fixModuleLocForWebpackByOS(
          resolve(pluginItem.guestPkgInfo.pkgRootDir, ...pluginItem.initModuleLoc),
        )
        // const importInitModule = `${guestPkgId.name}/@moodlenet/react-app/init`

        return `
    {
      pkgId: Object.freeze(${JSON.stringify(pluginItem.guestPkgId)}),
      deps: ${JSON.stringify(
        Object.entries(pluginItem.deps).reduce(
          (_, [depName, { pkgId: targetPkgId, rpc }]) => ({
            ..._,
            [depName]: {
              targetPkgId,
              rpcPaths: Object.keys(rpc),
            },
          }),
          {},
        ),
      )},
      init: async () =>
        import('${importInitModule}')
    }`
      })
      .join(',')}
  ]
  `
}

//   return `
// /*******************************
// generated Package Connection Module for:

// ${sortedPlugins.map(_ => _.guestPkgId.name).join('\n')}
// *******************************/
//   ${sortedPlugins
//     .map(
//       (pluginItem, index) => `
// import pkg_main_component_${index} from '${fixModuleLocForWebpackByOS(
//         resolve(pluginItem.guestPkgInfo.pkgRootDir, ...pluginItem.initModuleLoc),
//       )}' // pkg: ${pluginItem.guestPkgId.name}
//     `,
//     )
//     .join('')}

//     const pkgs = []
//     export default {
//       pkgs
//     }

//   ${sortedPlugins
//     .map(
//       (pluginItem, index) => `

// // connect ${pluginItem.guestPkgId.name} (pkg_main_component_${index})

//   pkgs.push({
//     MainComponent:pkg_main_component_${index},
//     pkgId:Object.freeze(${JSON.stringify(pluginItem.guestPkgId)}),
//     deps: ${JSON.stringify(
//       Object.entries(pluginItem.deps).reduce(
//         (_, [depName, { pkgId, rpc }]) => ({
//           ..._,
//           [depName]: {
//             pkgId,
//             rpcPaths: Object.keys(rpc),
//           },
//         }),
//         {},
//       ),
//     )}
//   })

// `,
//     )
//     .join('')}
// console.log('\\n--------- all pkgs connected ---------\\n\\n')
// `
