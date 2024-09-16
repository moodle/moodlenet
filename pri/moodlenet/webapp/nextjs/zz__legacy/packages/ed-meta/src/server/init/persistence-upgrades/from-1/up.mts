import { create } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import type { BloomCognitiveDataType } from '../../../types.mjs'
import { BloomCognitive } from '../../sys-entities.mjs'
import BloomCognitiveData from './raw/Bloom-taxonomy-cognitive-DATA.mjs'

await Promise.all([initBloomCognitive()])

export default 2

async function initBloomCognitive() {
  const BloomCognitiveDataDocs = Object.entries(BloomCognitiveData).map(
    ([_key, { name, verbs }]) => {
      const BloomCognitiveDataDoc: BloomCognitiveDataType & { _key: string } = {
        _key,
        name,
        verbs,
        published: true,
      }
      return BloomCognitiveDataDoc
    },
  )
  await Promise.all(
    BloomCognitiveDataDocs.map(BloomCognitiveDataDoc => {
      return shell.call(create)(BloomCognitive.entityClass, BloomCognitiveDataDoc, {
        pkgCreator: true,
      })
    }),
  )
}
