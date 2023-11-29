import { par } from '../types.mjs'

const data: [name: string, code: string][] = [
  ['Early childhood education', 'ED0'],
  ['Primary education', 'ED1'],
  ['Lower secondary education', 'ED2'],
  ['Upper secondary education', 'ED3'],
  ['Post-secondary non-tertiary education', 'ED4'],
  ['Tertiary education', 'ED5'],
  ['Bachelor’s or equivalent', 'ED6'],
  ['Master’s or equivalent', 'ED7'],
  ['Doctoral or equivalent', 'ED8'],
  ['Adult Education', 'ADT'],
]

const openaiSystem = [
  `you are a specialist in categorizing an educational resource by the most suitable isced-grade code`,
  `use the following standard ${par('iscedGradeCode')} code-mapping:
${data.map(([name, code]) => `"${code}": "${name}"`).join('\n')}
note that if a resource is non suitable for underage students, you should pick the special custom code "ADT" to mark the resource as intended for an adult audience
`,
]

export default {
  data,
  openaiSystem,
}
