import { assertRpcFileReadable, readableRpcFile, RpcFile } from '@moodlenet/core'
import { createWriteStream } from 'fs'
import { open } from 'fs/promises'
import { join } from 'path'
import { getOrgData, setOrgData } from './lib.mjs'
import shell from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    'setOrgData': {
      guard: () => void 0,
      fn: setOrgData,
    },
    'getOrgData': {
      guard: () => void 0,
      fn: getOrgData,
    },
    '__________REMOVE_ME__test_rpcFiles/:id/aa': {
      guard: () => void 0,
      async fn(body: { a: string; b: [RpcFile] }, { id }: { id: string }, { by }: { by: string }) {
        console.log(
          `__________REMOVE_ME__test_rpcFiles_body_b id:${id}, by:${by}:`,
          JSON.stringify(body.b, null, 4),
        )
        const rpcFile = body.b[0]
        const readable = await assertRpcFileReadable(rpcFile)
        readable.setEncoding('utf8')
        const content = readable.read()
        console.log({ __________REMOVE_ME__test_rpcFiles_body_files: content })
        ;(await assertRpcFileReadable(rpcFile)).pipe(
          createWriteStream(
            join(shell.baseFsFolder, `${rpcFile.name}-${String(Math.random()).substring(2, 5)}`),
            { autoClose: true },
          ),
        )
        return { ...body, content, id, by }
        // return body.b[0]
      },
      bodyWithFiles: {
        fields: {
          '.b': 1,
        },
      },
    },
    '__________REMOVE_ME__test_streamResponse': {
      guard: () => void 0,
      async fn() {
        console.log('__________REMOVE_ME__test_streamResponse')
        const name = 'package-lock.json'
        const size = await (async () => {
          const inode = await open(name, 'r')
          return (await inode.stat()).size
        })()
        return readableRpcFile(
          {
            name,
            type: 'application/json',
            size,
          },
          async () => {
            const inode = await open(name, 'r')
            return inode.createReadStream()
          },
        )
        // return { __stream, __mimetype: 'image/svg' }
      },
    },
  },
})
