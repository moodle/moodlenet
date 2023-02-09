import { ensureCollections, query } from '@moodlenet/arangodb'
import { assertRpcFileReadable, readableRpcFile, RpcFile, Shell } from '@moodlenet/core'
import assert from 'assert'
import { mkdir, open, writeFile } from 'fs/promises'
import { resolve } from 'path'
import rimraf from 'rimraf'
export const COLLECTION_NAME = 'Moodlenet_simple_file_store'

export default async function storeFactory(shell: Shell) {
  const storeBaseFsFolder = resolve(shell.baseFsFolder, 'simple-file-store')
  await mkdir(storeBaseFsFolder, { recursive: true })
  await shell.call(ensureCollections)({ defs: { [COLLECTION_NAME]: { kind: 'node' } } })
  const fsStore = {
    create: shell.call(create),
    get: shell.call(get),
    del: shell.call(del),
    ls: shell.call(ls),
  }
  return fsStore

  async function get(logicalName: string): Promise<undefined | FsItem> {
    const maybeRawDbRecord: RawDbRecord | undefined = (
      await query({
        q: `FOR fileRecord in ${COLLECTION_NAME}
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
    const lsQuery = `FOR fileRecord in ${COLLECTION_NAME}
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

  async function create(logicalName: string, rpcFile: RpcFile): Promise<FsItem> {
    const logicalPath = getLogicalPath(logicalName)

    const fsFileRelativePath = newFsFileRelativePath()
    const fsFileAbsolutePath = resolve(storeBaseFsFolder, ...fsFileRelativePath)
    const storeInDir = resolve(storeBaseFsFolder, ...fsFileRelativePath.slice(0, -1))
    // // console.log('create', { storeInDir, logicalName, rpcFile })

    const rpcFileReadable = await assertRpcFileReadable(rpcFile)

    // // console.log('create', { fsFileRelativePath, fsFileAbsolutePath })

    await mkdir(storeInDir, { recursive: true })
    await writeFile(fsFileAbsolutePath, rpcFileReadable)

    const partRawDbRecord: Omit<RawDbRecord, '_key' | 'created'> = {
      fsFileRelativePath,
      logicalPath,
      logicalName,
      logicalPathLength: logicalPath.length,
      rpcFile: {
        name: rpcFile.name,
        size: rpcFile.size,
        type: rpcFile.type,
      },
    }

    // // console.log('create', { partRawDbRecord })
    const newRawDbRecord: RawDbRecord | undefined = (
      await query({
        q: `let newRecord = MERGE(@partRawDbRecord, { 
              created: DATE_ISO8601(DATE_NOW()),
            })
            INSERT newRecord IN ${COLLECTION_NAME} 
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

    const newFsItem = getFsItem(newRawDbRecord)
    // // console.log('save', { newFsItem, newRawDbRecord })

    return newFsItem
  }

  async function del(logicalName: string): Promise<null | FsItem> {
    const maybeRawDbRecord: RawDbRecord | undefined = (
      await query({
        q: `FOR fileRecord in ${COLLECTION_NAME}
          FILTER fileRecord.logicalName == @logicalName
          LIMIT 1
          REMOVE fileRecord IN ${COLLECTION_NAME}
        RETURN OLD`,
        bindVars: { logicalName },
      })
    ).resultSet[0]
    if (!maybeRawDbRecord) {
      return null
    }
    const rawDbRecord = maybeRawDbRecord

    const fsFileAbsolutePath = resolve(storeBaseFsFolder, ...rawDbRecord.fsFileRelativePath)

    await rimraf(fsFileAbsolutePath, { maxRetries: 10 }).catch(async err => {
      // FIXME: really should reinsert ? ^^'
      await query({
        q: `INSERT @rawDbRecord IN ${COLLECTION_NAME} RETURN NEW`,
        bindVars: { rawDbRecord },
      })
      throw err
    })

    return {
      created: rawDbRecord.created,
      logicalName: rawDbRecord.logicalName,
      rpcFile: rawDbRecord.rpcFile,
    }
  }

  function getFsItem(rawDbRecord: RawDbRecord): FsItem {
    readableRpcFile(rawDbRecord.rpcFile, async function getReadable() {
      const fullFsName = resolve(storeBaseFsFolder, ...rawDbRecord.fsFileRelativePath)
      const fd = await open(fullFsName, 'r')
      // // console.log('readable of dbRecord:', { dbRecord, fullFsName, stat: await fd.stat() })
      const readable = fd.createReadStream({ autoClose: true })
      return readable
    })
    return {
      created: rawDbRecord.created,
      logicalName: rawDbRecord.logicalName,
      rpcFile: rawDbRecord.rpcFile,
    }
  }
}
function newFsFileRelativePath() {
  const now = new Date()
  return [
    'Y-' + String(now.getFullYear()),
    'M-' + String(now.getMonth() + 1).padStart(2, '0'),
    'D-' + String(now.getUTCDate()).padStart(2, '0'),
    'h-' + String(now.getUTCHours()).padStart(2, '0'),
    'm-' + String(now.getMinutes()).padStart(2, '0'),
    's-' + String(now.getSeconds()).padStart(2, '0'),
    String(Math.random()).substring(2, 20),
  ]
}

type RawDbRecord = FsItem & {
  _key: string
  logicalPath: string[]
  logicalPathLength: number
  fsFileRelativePath: string[]
}

type FsItem = {
  logicalName: string
  rpcFile: RpcFile
  created: string
}

function getLogicalPath(logicalName: string) {
  return logicalName ? logicalName.split('/') : []
}
