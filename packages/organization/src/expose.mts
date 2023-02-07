import { getRpcFileHandler, RpcFile } from '@moodlenet/core'
import { getOrgData, setOrgData } from './lib.mjs'
import shell from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    setOrgData: {
      guard: () => void 0,
      fn: setOrgData,
    },
    getOrgData: {
      guard: () => void 0,
      fn: getOrgData,
    },
    __________REMOVE_ME__test_rpcFiles: {
      guard: () => void 0,
      async fn(body: { a: string; b: [RpcFile] }) {
        console.log('__________REMOVE_ME__test_rpcFiles_body_b:', JSON.stringify(body.b, null, 4))
        const readable = await getRpcFileHandler(body.b[0]).getReadable()

        console.log({ __________REMOVE_ME__test_rpcFiles_body_files: readable.read() })
        return body
      },
      bodyWithFiles: {
        fields: {
          '.b': 1,
        },
      },
    },
  },
})
