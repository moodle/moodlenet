import { ExtPluginsMap } from './types'
export function generateExposedModule({ extPluginsMap }: { extPluginsMap: ExtPluginsMap }) {
  console.log(`generate exposed.ts ..`)

  return `// - generated -
const exp: Record<string, any> = {
${Object.values(extPluginsMap)
  .map(extPlugin => {
    return !extPlugin.expose
      ? null
      : `
'${extPlugin.extName}': require('${extPlugin.expose.moduleLoc}').default
`
  })
  .filter(Boolean)
  .join(',\n')}
}
//module.exports=exp
export default exp
`
}
