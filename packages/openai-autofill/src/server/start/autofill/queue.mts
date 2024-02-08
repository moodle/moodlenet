import type { PersistentContext } from '@moodlenet/core-domain/resource'
import type { ResourceDataType, ResourceEntityDoc } from '@moodlenet/ed-resource/server'
import { Resource } from '@moodlenet/ed-resource/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { shell } from '../../shell.mjs'
import { stepMachine } from './step-machine.mjs'

async function findOneWaiting() {
  const persistentContextKey: keyof ResourceDataType = 'persistentContext' as const
  const stateKey: keyof PersistentContext = 'state'
  const stateVal: ResourceDataType[typeof persistentContextKey][typeof stateKey] =
    'Autogenerating-Meta'

  const cursor = await sysEntitiesDB.query<ResourceEntityDoc>(
    `
FOR res IN @@ResourceCollection
FILTER res.${persistentContextKey}.${stateKey} == @stateVal
LIMIT 1
RETURN res
`,
    {
      '@ResourceCollection': Resource.collection.name,
      stateVal,
    },
  )
  const resourceDoc = await cursor.next()
  cursor.kill()
  if (!resourceDoc) {
    return 'none' as const
  }
  shell.log('notice', `[autofill-queue] will stepMachine for resource ${resourceDoc._key}`)
  return await stepMachine(resourceDoc._key).then(
    () => {
      shell.log('notice', `[autofill-queue] generateMetaNow for resource ${resourceDoc._key}`)
      return 'done one' as const
    },
    err => {
      shell.log(
        'error',
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
        return res === 'none' ? 5_000 : res === 'done one' ? 500 : res === 'error' ? 1_000 : res
      })
    enqueueOneWaiting(nextAfter)
  }, after)
}

enqueueOneWaiting(0)
