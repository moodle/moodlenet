import type { RpcFile } from '@moodlenet/core'
import { readableRpcFile } from '@moodlenet/core'
import { stdEdResourceMachine, updateImage } from '@moodlenet/ed-resource/server'
import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import axios from 'axios'
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

    const generateResult = await generateMeta(doc).catch(err => {
      shell.log('error', `{Error}[autofill] generateMeta failed for resource ${resourceKey}`, err)
      return null
    })
    const generatedImageUrl = generateResult?.imageUrl
    if (!doc.image && generatedImageUrl) {
      const headResp = await axios.head(generatedImageUrl)
      const size = Number(headResp.headers['content-length'])
      const type = String(headResp.headers['content-type'])
      const ext = type.split('/')[1]
      const _baseRpcFile: RpcFile = { name: `generated.${ext}`, type, size }
      // console.log({ _baseRpcFile })
      const imageRpcFile = readableRpcFile(_baseRpcFile, async () => {
        const getResp = await axios.get(generatedImageUrl, { responseType: 'stream' })
        return getResp.data
      })

      await updateImage(doc.id.resourceKey, { kind: 'file', rpcFile: imageRpcFile, size })
    }

    interpreter.send({
      type: 'generated-meta-suggestions',
      generatedData: generateResult?.generatedData ?? { meta: {} },
    })
    interpreter.stop()
  })
}
