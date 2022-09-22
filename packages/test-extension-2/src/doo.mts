import { testExtensionApis } from './pkgApis.mjs'

const d = await testExtensionApis('mamma/ciccio')({ ctx: {} })({ str: '0', x: { a: 33 } })

console.log({ d })
