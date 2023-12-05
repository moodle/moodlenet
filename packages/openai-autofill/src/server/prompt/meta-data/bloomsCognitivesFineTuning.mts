import { BloomCognitive } from '@moodlenet/ed-meta/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { bcAttr, par } from '../types.mjs'

export default async function () {
  const dataCursor = await sysEntitiesDB.query<[name: string, verbs: string[], code: string]>(
    `
FOR bc IN @@collection
RETURN [bc.name,bc.verbs,bc._key]
`,
    {
      '@collection': BloomCognitive.collection.name,
    },
  )
  const data = await dataCursor.all()
  dataCursor.kill()

  const openaiSystem = [
    `you are a specialist in categorizing an educational resource by inferring a small set (at least one, at most five) of learning outcomes following the "Blooms Cognitive Taxonomy" standard`,
    `each learning outcome (${par(
      'bloomsCognitive',
    )}" parameter element) must comprehend three information: the "Blooms Cognitive Taxonomy Level" code, a "verb" and a "description"`,
    `the ${bcAttr('bloomsLevelCode')} is the associated code for "Blooms Cognitive Taxonomy Level"`,
    `the ${bcAttr(
      'learningOutcomeVerbCode',
    )} must be one of the verbs associated o the selected "bloomsLevelCode", it acts as the first word for the description`,
    `the ${bcAttr(
      'learningOutcomeDescription',
    )} must be a one-liner description of the resource learning outcome. It must **IMPLICITLY** start with the selected "learningOutcomeVerbCode" omitting it from the description`,
    `here's the standard "Blooms Cognitive Taxonomy" code and associated verbs mapping:

${data
  .map(([name, verbs, code]) => `"${code}": "${name}" ; associaed verbs: "${verbs.join('", "')}"`)
  .join('\n')}`,
  ]

  return {
    data,
    openaiSystem,
  }
}
