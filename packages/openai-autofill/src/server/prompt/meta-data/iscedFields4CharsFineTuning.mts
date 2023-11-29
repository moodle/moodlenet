import { par } from '../types.mjs'

const data: [name: string, code: string][] = [
  ['Basic programmes and qualifications', 'F001'],
  ['Literacy and numeracy', 'F002'],
  ['Personal skills and development', 'F003'],
  ['Inter-disciplinary programmes and qualifications involving education', 'F018'],
  ['Arts', 'F021'],
  ['Humanities (except languages)', 'F022'],
  ['Languages', 'F023'],
  ['Inter-disciplinary programmes and qualifications involving arts and humanities', 'F028'],
  ['Social and behavioural sciences', 'F031'],
  ['Journalism and information', 'F032'],
  [
    'Inter-disciplinary programmes and qualifications involving social sciences, journalism and information',
    'F038',
  ],
  ['Business and administration', 'F041'],
  ['Law', 'F042'],
  [
    'Inter-disciplinary programmes and qualifications involving business, administration and law',
    'F048',
  ],
  ['Biological and related sciences', 'F051'],
  ['Environment', 'F052'],
  ['Physical sciences', 'F053'],
  ['Mathematics and statistics', 'F054'],
  [
    'Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics',
    'F058',
  ],
  [
    'Inter-disciplinary programmes and qualifications involving information and Communication Technologies',
    'F068',
  ],
  ['Engineering and engineering trades', 'F071'],
  ['Manufacturing and processing', 'F072'],
  ['Architecture and construction', 'F073'],
  [
    'Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction',
    'F078',
  ],
  ['Agriculture', 'F081'],
  ['Forestry', 'F082'],
  ['Fisheries', 'F083'],
  ['Veterinary', 'F084'],
  [
    'Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary',
    'F088',
  ],
  ['Health', 'F091'],
  ['Welfare', 'F092'],
  ['Inter-disciplinary programmes and qualifications involving health and welfare', 'F098'],
  ['Personal services', 'F101'],
  ['Hygiene and occupational health services', 'F102'],
  ['Security services', 'F103'],
  ['Transport services', 'F104'],
  ['Inter-disciplinary programmes and qualifications involving services', 'F108'],
]

const openaiSystem = [
  `you are a specialist in categorizing an educational resource by the most suitable isced-field code`,
  `use the following standard ${par('iscedFieldCode')} code-mapping:
${data.map(([name, code]) => `"${code}": "${name}"`).join('\n')}`,
]
export default {
  data,
  openaiSystem,
}
