import { ensureCollections, query } from '@moodlenet/arangodb'
import { assertRpcFileReadable, readableRpcFile, RpcFile, Shell } from '@moodlenet/core'
import { mountApp } from '@moodlenet/http-server'
import assert from 'assert'
import { mkdir, open, readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import rimraf from 'rimraf'
export const BASE_COLLECTION_NAME = 'Moodlenet_simple_file_store'

export default async function storeFactory(shell: Shell, bucketName: string) {
  const storeBaseFsFolder = resolve(shell.baseFsFolder, 'simple-file-store', bucketName)
  const collectionName = `${BASE_COLLECTION_NAME}_${bucketName}`
  await mkdir(storeBaseFsFolder, { recursive: true })
  await shell.call(ensureCollections)({ defs: { [collectionName]: { kind: 'node' } } })
  const fsStore = {
    create: shell.call(create),
    get: shell.call(get),
    del: shell.call(del),
    ls: shell.call(ls),
    getRpcFileByDirectAccessId: shell.call(getRpcFileByDirectAccessId),
    mountStaticHttpServer: shell.call(mountStaticHttpServer),
  }
  return fsStore

  // function rpcDirectAccess(logicalName: string): RpcDefItem {
  //   return {
  //     guard: () => void 0,
  //     async fn() {},
  //   }
  // }

  async function get(logicalName: string): Promise<undefined | FsItem> {
    const maybeRawDbRecord: RawDbRecord | undefined = (
      await query({
        q: `FOR fileRecord in ${collectionName}
              FILTER fileRecord.logicalName == @logicalName
              LIMIT 1
            RETURN fileRecord`,
        bindVars: { logicalName },
      })
    ).resultSet[0]
    if (!maybeRawDbRecord) {
      return undefined
    }
    const rawDbRecord = maybeRawDbRecord

    const fsItem = getFsItem(rawDbRecord)
    return fsItem
  }

  async function getRpcFileByDirectAccessId(directAccessId: string): Promise<RpcFile> {
    const { fd, fileAbsPath } = await getFileDescriptorByDirectAccessId(directAccessId)
    let rpcFile: RpcFile

    try {
      const fsItemStr = await readFile(`${fileAbsPath}_rpc_file`, { encoding: 'utf-8' })
      rpcFile = JSON.parse(fsItemStr)
    } catch {
      const fdStat = await fd.stat()
      const defName = directAccessId.split('/').pop() ?? 'no-name'
      rpcFile = {
        name: defName,
        size: fdStat.size,
        type: '',
      }
    }
    readableRpcFileBydirectAccessId(rpcFile, directAccessId)
    return rpcFile
  }

  type LsOpts = { maxDepth: number; path: string }
  async function ls(pOpts?: Partial<LsOpts>): Promise<undefined | FsItem[]> {
    const opts: LsOpts = { maxDepth: pOpts?.maxDepth || 0, path: pOpts?.path || '' }
    const searchInLogicalPath = getLogicalPath(opts.path)
    const logicalPathMinLength = searchInLogicalPath.length + 1
    const logicalPathMaxLength = logicalPathMinLength + opts.maxDepth
    // console.log({ opts, pOpts, logicalPathMinLength, logicalPathMaxLength })
    const pathLengthFilter = opts.maxDepth
      ? [
          `fileRecord.logicalPathLength >= @logicalPathMinLength`,
          `fileRecord.logicalPathLength <= @logicalPathMaxLength`,
        ]
      : [`fileRecord.logicalPathLength == @logicalPathMinLength`]

    const pathFilter = searchInLogicalPath.map(
      (pathSegm, index) => `fileRecord.logicalPath[${index}] == ${JSON.stringify(pathSegm)}`,
    )

    const allFilters = pathLengthFilter.concat(pathFilter).join(`\n AND `)
    const lsQuery = `FOR fileRecord in ${collectionName}
    FILTER ${allFilters}
  RETURN fileRecord`
    // console.log(lsQuery)
    const rawDbRecords: RawDbRecord[] = (
      await query({
        q: lsQuery,
        bindVars: opts.maxDepth
          ? { logicalPathMinLength, logicalPathMaxLength }
          : { logicalPathMinLength },
      })
    ).resultSet
    const fsItems = rawDbRecords.map(getFsItem)
    return fsItems
  }

  async function create(logicalName: string, _rpcFile: RpcFile): Promise<FsItem> {
    const fsFileRelativePath = newFsFileRelativePath(_rpcFile.name)
    const storeInDir = resolve(storeBaseFsFolder, ...fsFileRelativePath.slice(0, -1))

    await mkdir(storeInDir, { recursive: true })

    const fsFileAbsolutePath = resolve(storeBaseFsFolder, ...fsFileRelativePath)
    const rpcFileReadable = await assertRpcFileReadable(_rpcFile)

    const logicalPath = getLogicalPath(logicalName)
    const directAccessId = fsFileRelativePath.join('/')
    const rpcFile: RpcFile = {
      name: _rpcFile.name,
      size: _rpcFile.size,
      type: _rpcFile.type,
    }

    const partRawDbRecord: Omit<RawDbRecord, '_key' | 'created'> = {
      logicalName,
      rpcFile,
      logicalPath,
      directAccessId,
      logicalPathLength: logicalPath.length,
    }

    await writeFile(`${fsFileAbsolutePath}`, rpcFileReadable)

    // // console.log('create', { partRawDbRecord })
    const newRawDbRecord: RawDbRecord | undefined = (
      await query({
        q: `let newRecord = MERGE(@partRawDbRecord, { 
              created: DATE_ISO8601(DATE_NOW()),
            })
            INSERT newRecord IN ${collectionName} 
            RETURN NEW`,
        bindVars: {
          partRawDbRecord,
        },
      }).catch(async err => {
        await rimraf(fsFileAbsolutePath, { maxRetries: 10 })
        throw err
      })
    ).resultSet[0]
    assert(newRawDbRecord, `couldn't store in DB, shouldn't happen !`)

    await writeFile(`${fsFileAbsolutePath}_rpc_file`, JSON.stringify(newRawDbRecord.rpcFile), {
      encoding: 'utf-8',
    })

    const newFsItem = getFsItem(newRawDbRecord)
    return newFsItem
  }

  async function del(logicalName: string): Promise<null | FsItem> {
    const maybeRawDbRecord: RawDbRecord | undefined = (
      await query({
        q: `FOR fileRecord in ${collectionName}
          FILTER fileRecord.logicalName == @logicalName
          LIMIT 1
          REMOVE fileRecord IN ${collectionName}
        RETURN OLD`,
        bindVars: { logicalName },
      })
    ).resultSet[0]
    if (!maybeRawDbRecord) {
      return null
    }
    const rawDbRecord = maybeRawDbRecord

    const fsFileAbsolutePath = getFsAbsolutePathByDirectAccessId(rawDbRecord.directAccessId)

    await rimraf(`${fsFileAbsolutePath}*`, { maxRetries: 10 }).catch(async err => {
      // FIXME: really should reinsert ? ^^'
      await query({
        q: `INSERT @rawDbRecord IN ${collectionName} RETURN NEW`,
        bindVars: { rawDbRecord },
      })
      throw err
    })

    return {
      created: rawDbRecord.created,
      logicalName: rawDbRecord.logicalName,
      rpcFile: rawDbRecord.rpcFile,
      directAccessId: rawDbRecord.directAccessId,
    }
  }

  function getFsItem(rawDbRecord: RawDbRecord): FsItem {
    readableRpcFileBydirectAccessId(rawDbRecord.rpcFile, rawDbRecord.directAccessId)
    return {
      created: rawDbRecord.created,
      logicalName: rawDbRecord.logicalName,
      rpcFile: rawDbRecord.rpcFile,
      directAccessId: rawDbRecord.directAccessId,
    }
  }

  function readableRpcFileBydirectAccessId(rpcFile: RpcFile, directAccessId: string) {
    readableRpcFile(rpcFile, async function getReadable() {
      const { readable } = await fdAndReadableBydirectAccessId(directAccessId)
      return readable
    })
  }

  async function fdAndReadableBydirectAccessId(directAccessId: string) {
    const { fd } = await getFileDescriptorByDirectAccessId(directAccessId)
    const readable = fd.createReadStream({ autoClose: true })
    return { readable, fd }
  }

  function getFsAbsolutePathByDirectAccessId(directAccessId: string) {
    const fileAbsPath = resolve(storeBaseFsFolder, ...directAccessId.split('/'))
    return fileAbsPath
  }

  async function getFileDescriptorByDirectAccessId(directAccessId: string) {
    const fileAbsPath = getFsAbsolutePathByDirectAccessId(directAccessId)
    const fd = await open(fileAbsPath, 'r')
    return { fileAbsPath, fd }
  }

  async function mountStaticHttpServer(path: string) {
    mountApp({
      getApp(express) {
        const basePathApp = express()
        const app = express()
        basePathApp.use(path, app)
        app.use(express.static(storeBaseFsFolder))
        return basePathApp
      },
    })
  }
}
function newFsFileRelativePath(originalFilename: string) {
  const origExt = originalFilename.split('.').pop()
  const mDotExt = origExt ? `.${origExt}` : ''
  const now = new Date()
  return [
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
    String(now.getUTCHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
    String(Math.random()).substring(2, 20) + mDotExt,
  ]
}

type RawDbRecord = FsItem & {
  _key: string
  logicalPath: string[]
  logicalPathLength: number
}

type FsItem = {
  logicalName: string
  rpcFile: RpcFile
  created: string
  directAccessId: string
}

function getLogicalPath(logicalName: string) {
  return logicalName ? logicalName.split('/') : []
}
