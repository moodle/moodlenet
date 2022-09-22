import testExtension from '@moodlenet/test-extension'

const x = testExtension.apis(import.meta)('mamma/ciccio')({ primary: true })
const d = await x({ str: '0', x: { a: 33 } })

console.log({ d })
