import type { ResourceDataType, ResourceEntityDoc } from '@moodlenet/ed-resource/server'
import { Resource } from '@moodlenet/ed-resource/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { stepMachine } from './step-machine.mjs'

async function findOneWaiting() {
  const persistentContextKey: keyof ResourceDataType = 'persistentContext' as const
  const findByContext: Partial<ResourceDataType[typeof persistentContextKey]> = {
    state: 'Autogenerating-Meta',
  }
  const cursor = await sysEntitiesDB.query<ResourceEntityDoc>(
    `
FOR res IN @@ResourceCollection
FILTER res.${persistentContextKey} == @findByContext
LIMIT 1
RETURN res
`,
    {
      '@ResourceCollection': Resource.collection.name,
      findByContext,
    },
  )
  const resourceDoc = await cursor.next()
  cursor.kill()
  if (!resourceDoc) {
    return 'none' as const
  }
  return await stepMachine(resourceDoc._key).then(
    (/* meta */) => {
      // console.log(`[autofill-queue] generateMetaNow for resource ${resourceDoc._key}`, meta)
      return 'done one' as const
    },
    err => {
      console.error(
        `{Error}[autofill-queue] generateMetaNow failed for resource ${resourceDoc._key}`,
        err,
      )
      return 'error' as const
    },
  )
}

function enqueueOneWaiting(after: number) {
  setTimeout(async () => {
    const nextAfter = await findOneWaiting()
      .catch(() => 30_000)
      .then(res => {
        return res === 'none' ? 10_000 : res === 'done one' ? 1_000 : res === 'error' ? 10_000 : res
      })
    enqueueOneWaiting(nextAfter)
  }, after)
}

enqueueOneWaiting(0)
