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
    // '__________REMOVE_ME__test_ls_files': {
    //   guard: () => void 0,
    //   async fn(_, __, q: { path?: string; maxDepth?: string }) {
    //     console.log(q)
    //     const maxDepth = q.maxDepth ? Number(q.maxDepth) || 0 : 0
    //     //path/to/logicalFilename/for/filename
    //     const ls = await fsStore.ls({ path: q.path, maxDepth })
    //     return { ls }
    //   },
    // },
    // '__________REMOVE_ME__test_rpcFiles/:id/aa': {
    //   guard: () => void 0,
    //   async fn(body: { a: string; b: [RpcFile] }, { id }: { id: string }, { by }: { by: string }) {
    //     console.log(
    //       `__________REMOVE_ME__test_rpcFiles_body_b id:${id}, by:${by}:`,
    //       JSON.stringify(body.b, null, 4),
    //     )
    //     const rpcFile = body.b[0]

    //     const logicalFilename = `path/to/logicalFilename/for/filename/${rpcFile.name}`
    //     await fsStore.create(logicalFilename, rpcFile)
    //     const content = await fsStore.get(logicalFilename).then(async fsItem => {
    //       if (!fsItem) {
    //         return '!!!!!! no fsItem found !'
    //       }
    //       const readable = await assertRpcFileReadable(fsItem.rpcFile)
    //       return new Promise(resolve => {
    //         console.log({ readingFsItem: fsItem, readable })
    //         readable.setEncoding('utf8')
    //         let c = ''
    //         readable.on('data', _ => (c += _))
    //         readable.read(100)
    //         readable.on('end', () => resolve(c))

    //         return c
    //       })
    //     })

    //     console.log({ __________REMOVE_ME__test_rpcFile_content: content })
    //     // ;(await assertRpcFileReadable(rpcFile)).pipe(
    //     //   createWriteStream(
    //     //     join(shell.baseFsFolder, `${rpcFile.name}-${String(Math.random()).substring(2, 5)}`),
    //     //   ),
    //     // )
    //     const ls = await fsStore.ls({ path: 'path/to/logicalFilename/for/filename', maxDepth: 2 })
    //     return { ...body, content, id, by, ls }
    //     // return body.b[0]
    //   },
    //   bodyWithFiles: {
    //     fields: {
    //       '.b': 1,
    //     },
    //   },
    // },
    // '__________REMOVE_ME__test_streamResponse': {
    //   guard: () => void 0,
    //   async fn() {
    //     console.log('__________REMOVE_ME__test_streamResponse')
    //     const name = 'package-lock.json'
    //     const size = await (async () => {
    //       const fd = await open(name, 'r')
    //       return (await fd.stat()).size
    //     })()
    //     return readableRpcFile(
    //       {
    //         name,
    //         type: 'application/json',
    //         size,
    //       },
    //       async () => {
    //         const fd = await open(name, 'r')
    //         return fd.createReadStream({ autoClose: true })
    //       },
    //     )
    //     // return { __stream, __mimetype: 'image/svg' }
    //   },
    // },
    // '__________REMOVE_ME__test_streamResponse-from-store': {
    //   guard: () => void 0,
    //   async fn(_, { id }) {
    //     console.log('__________REMOVE_ME__test_streamResponse-from-store')
    //     const fsItem = await fsStore.get(`path/to/logicalFilename/for/filename/${id}`)

    //     if (!fsItem) {
    //       return '!!!!!! no fsItem found !'
    //     }
    //     return fsItem.rpcFile
    //   },
    // },
  },
})
