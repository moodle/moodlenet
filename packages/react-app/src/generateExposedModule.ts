import { ExtPluginsMap } from './types'
import { fixModuleLocForWebpackByOS } from './util'
export function generateExposedModule({ extPluginsMap }: { extPluginsMap: ExtPluginsMap }) {
  return `// - generated -
const exp: Record<string, ExtExpose> = {
${Object.values(extPluginsMap)
  .map(extPlugin => {
    return !extPlugin.expose
      ? null
      : `
  '${extPlugin.extName}': {
    lib: require('file:${fixModuleLocForWebpackByOS(extPlugin.expose.moduleLoc)}').default,
    extName: '${extPlugin.extName}',
    extVersion:'${extPlugin.extVersion}',
    extId:'${extPlugin.extId}',    
  }
`
  })
  .filter(Boolean)
  .join(',\n')}
}
//module.exports=exp
export default exp
`
}
