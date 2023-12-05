import { IscedGrade } from '@moodlenet/ed-meta/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { par } from '../types.mjs'
export default async function () {
  const dataCursor = await sysEntitiesDB.query<[name: string, code: string]>(
    `FOR f IN @@collection
FILTER f.published
RETURN [f.name,f._key]`,
    {
      '@collection': IscedGrade.collection.name,
    },
  )
  const data = await dataCursor.all()
  dataCursor.kill()

  const openaiSystem = [
    `you are a specialist in categorizing an educational resource by the most suitable isced-grade code`,
    `use the following standard ${par('iscedGradeCode')} code-mapping:
${data.map(([name, code]) => `"${code}": "${name}"`).join('\n')}
note that if a resource is non suitable for underage students, you should pick the special custom code "ADT" to mark the resource as intended for an adult audience
`,
  ]

  return {
    data,
    openaiSystem,
  }
}
