import { ExtPluginsMap } from './types'
export function generateRoutesModule({ extPluginsMap }: { extPluginsMap: ExtPluginsMap }) {
  console.log(`generate routes.ts ..`)

  return `// - generated -
import { lazy } from 'react'
const routes: ExtRoute[]= [
${Object.values(extPluginsMap)
  .map(extPlugin => {
    return !extPlugin.routes
      ? null
      : `
{
rootPath: '${extPlugin.routes.rootPath}',
extRoutingElement: require('${extPlugin.routes.moduleLoc}').default,
extName: '${extPlugin.extName}',
extVersion:'${extPlugin.extVersion}',
extId:'${extPlugin.extId}',
}
`
  })
  .filter(Boolean)
  .join(',\n')}
]
export default routes
  
`
}
