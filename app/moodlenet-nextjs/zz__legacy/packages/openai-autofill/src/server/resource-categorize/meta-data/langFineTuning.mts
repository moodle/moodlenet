import { Language } from '@moodlenet/ed-meta/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { par } from '../types.mjs'
export default async function () {
  const dataCursor = await sysEntitiesDB.query<[name: string, code: string]>(
    `FOR f IN @@collection
FILTER f.published
RETURN [f.name,f._key]`,
    {
      '@collection': Language.collection.name,
    },
  )
  const data = await dataCursor.all()
  dataCursor.kill()

  const openaiSystem = [
    `you are a specialist in categorizing an educational resource identifying its most suitable language scope`,
    `use the following standard ${par('languageCode')} code-mapping:
${data.map(([name, code]) => `"${code}": "${name}"`).join('\n')}`,
  ]
  return {
    data,
    openaiSystem,
  }
}
