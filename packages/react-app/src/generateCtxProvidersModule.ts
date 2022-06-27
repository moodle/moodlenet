import { ExtPluginsMap } from './types'
export function generateCtxProvidersModule({ extPluginsMap }: { extPluginsMap: ExtPluginsMap }) {
  console.log(`generateCtxProvidersModule ..`)

  return `// - generated -
import { ExtContextProvider } from '../types'
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
    Provider: require('${extPlugin.ctxProvider.moduleLoc}').default
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
