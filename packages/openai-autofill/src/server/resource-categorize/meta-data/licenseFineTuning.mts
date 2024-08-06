import { License } from '@moodlenet/ed-meta/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { par } from '../types.mjs'
export default async function () {
  const dataCursor = await sysEntitiesDB.query<[name: string, code: string]>(
    `FOR f IN @@collection
FILTER f.published
RETURN [f.description,f.code]`,
    {
      '@collection': License.collection.name,
    },
  )
  const data = await dataCursor.all()
  dataCursor.kill()

  const openaiSystem = [
    `you are a specialist in categorizing an educational resource identifying its most suitable creative-commons license`,
    `use the following standard ${par('ccLicense')} code-mapping:
${data.map(([description, code]) => `"${code}": "${description}"`).join('\n')}`,
  ]
  return {
    data,
    openaiSystem,
  }
}
