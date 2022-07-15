import { ExtPluginsMap } from './types'
import { fixModuleLocForWebpackByOS } from './util'
export function generateCtxProvidersModule({ extPluginsMap }: { extPluginsMap: ExtPluginsMap }) {
  console.log(`generateCtxProvidersModule ..`)

  return `// - generated -
const ctxProviders: Record<string, ExtContextProvider> = {
${Object.values(extPluginsMap)
  .map(extPlugin => {
    return !extPlugin.ctxProvider
      ? null
      : `
  '${extPlugin.extName}': {
    extName: '${extPlugin.extName}',
    extVersion:'${extPlugin.extVersion}',
    extId:'${extPlugin.extId}',
    Provider: require('file:${fixModuleLocForWebpackByOS(extPlugin.ctxProvider.moduleLoc)}').default
  }
`
  })
  .filter(Boolean)
  .join(',\n')}
}
//module.exports=ctxProviders
export default ctxProviders
`
}
