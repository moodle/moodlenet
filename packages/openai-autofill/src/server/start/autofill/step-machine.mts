import type { ProvidedFileImage } from '@moodlenet/core-domain/resource'
import { silentlyUpdateImage, stdEdResourceMachine } from '@moodlenet/ed-resource/server'
import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../../shell.mjs'
import { generateMeta } from './generateMeta.mjs'

export async function stepMachine(resourceKey: string) {
  return shell.initiateCall(async () => {
    await setPkgCurrentUser()
    const [interpreter, , , , updated] = await stdEdResourceMachine({ by: 'key', key: resourceKey })
    const snap = interpreter.getSnapshot()
    if (!snap.can({ type: 'generated-meta-suggestions', generatedData: { meta: {} } })) {
      interpreter.stop()
      throw new Error(`cannot [generated-meta-suggestions] for resource ${resourceKey}`)
    }
    const doc = snap.context.doc

    const generateResult = await generateMeta(doc).catch(() => null)
    const generatedImageEdit: ProvidedFileImage | undefined = generateResult?.provideImage
      ? {
          kind: 'file',
          rpcFile: generateResult.provideImage,
          size: generateResult.provideImage.size,
        }
      : undefined
    if (!doc.image && generatedImageEdit) {
      await silentlyUpdateImage(doc.id.resourceKey, generatedImageEdit)
    }

    interpreter.send({
      type: 'generated-meta-suggestions',
      generatedData: generateResult?.generatedData ?? { meta: {} },
    })
    interpreter.stop()
    await updated
  })
}
