import type { ProvidedGeneratedData } from '@moodlenet/core-domain/resource'
import { stdEdResourceMachine } from '@moodlenet/ed-resource/server'
import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../../shell.mjs'
import { generateMeta } from './generateMeta.mjs'

export async function stepMachine(resourceKey: string) {
  return shell.initiateCall(async () => {
    setPkgCurrentUser()
    const [interpreter] = await stdEdResourceMachine({ by: 'key', key: resourceKey })
    const snap = interpreter.getSnapshot()
    if (!snap.can({ type: 'generated-meta-suggestions', generatedData: { meta: {} } })) {
      interpreter.stop()
      throw new Error(`cannot [generated-meta-suggestions] for resource ${resourceKey}`)
    }
    const doc = snap.context.doc

    const generatedData = await generateMeta(doc).catch<ProvidedGeneratedData>(err => {
      shell.log('error', `{Error}[autofill] generateMeta failed for resource ${resourceKey}`, err)
      return { meta: {} }
    })
    interpreter.send({ type: 'generated-meta-suggestions', generatedData })
    interpreter.stop()
    return generatedData
  })
}
