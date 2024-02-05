import { EdAssetType } from '@moodlenet/ed-meta/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { par } from '../types.mjs'

export default async function () {
  const dataCursor = await sysEntitiesDB.query<[name: string, code: string]>(
    `FOR f IN @@collection
FILTER f.published
RETURN [f.description,f._key]`,
    {
      '@collection': EdAssetType.collection.name,
    },
  )
  const data = await dataCursor.all()
  dataCursor.kill()

  const openaiSystem = [
    `you are a specialist in categorizing an educational resource identifying what kind of resource is it`,
    `use the following ${par('resourceTypeCode')} code-mapping:
${data.map(([name, code]) => `"${code}": "${name}"`).join('\n')}`,
  ]
  return {
    data,
    openaiSystem,
  }
}
