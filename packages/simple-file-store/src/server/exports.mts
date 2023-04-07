import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { assertRpcFileReadable, readableRpcFile, RpcFile, Shell } from '@moodlenet/core'
import { mountApp } from '@moodlenet/http-server/server'
import assert from 'assert'
import { mkdir, open, readdir, readFile, rmdir, stat, writeFile } from 'fs/promises'
import { resolve } from 'path'
import rimraf from 'rimraf'
import sanitizeFilename from 'sanitize-filename'
import { DbRecord, DbRecordData, FsItem, LsOpts } from './types.mjs'
export * from './types.mjs'
export const BASE_COLLECTION_NAME = 'Moodlenet_simple_file_store'

export type FSStore = Awaited<ReturnType<typeof fileStoreFactory>>

export default async function fileStoreFactory(shell: Shell, bucketName: string) {
  const storeBaseFsFolder = resolve(shell.baseFsFolder, 'simple-file-store', bucketName)
  const BUCKET_COLLECTION_NAME = `${BASE_COLLECTION_NAME}_${bucketName}`

  const { db } = await shell.call(getMyDB)()

  const { collection: BucketCollection /* ,newlyCreated */ } = await shell.call(
    ensureDocumentCollection,
  )<DbRecordData>(BUCKET_COLLECTION_NAME)

  await mkdir(storeBaseFsFolder, { recursive: true })

  const fsStore = {
    store: shell.call(store),
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
    const cursor = await db.query<DbRecord>(
      `FOR fileRecord in @@BucketCollection
              FILTER fileRecord.logicalName == @logicalName
              LIMIT 1
            RETURN fileRecord`,
      { logicalName, '@BucketCollection': BucketCollection.name },
    )

    const [maybeRawDbRecord] = await cursor.all()
    if (!maybeRawDbRecord) {
      return
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
    const lsQuery = `
      FOR fileRecord in @@BucketCollection
        FILTER ${allFilters}
      RETURN fileRecord`
    // console.log(lsQuery)
    const rawDbRecords = await db
      .query<DbRecord>(lsQuery, {
        '@BucketCollection': BucketCollection.name,
        logicalPathMinLength,
        ...(opts.maxDepth ? { logicalPathMaxLength } : null),
      })
      .then(_ => _.all())
    const fsItems = rawDbRecords.map(getFsItem)
    return fsItems
  }

  async function store(logicalName: string, _rpcFile: RpcFile): Promise<FsItem> {
    const rpcFileReadable = await assertRpcFileReadable(_rpcFile)
    await del(logicalName)
    const sanitizedFileName = getSanitizedFileName(_rpcFile.name)

    const fsFileRelativePath = newFsFileRelativePath(sanitizedFileName)
    const storeInDir = resolve(storeBaseFsFolder, ...fsFileRelativePath.slice(0, -1))

    await mkdir(storeInDir, { recursive: true })

    const fsFileAbsolutePath = resolve(storeBaseFsFolder, ...fsFileRelativePath)

    const logicalPath = getLogicalPath(logicalName)
    const directAccessId = fsFileRelativePath.join('/')

    await writeFile(fsFileAbsolutePath, rpcFileReadable)
    const { size } = await stat(fsFileAbsolutePath)

    const dbRecordData: DbRecordData = {
      logicalName,
      rpcFile: {
        ..._rpcFile,
        size,
      },
      logicalPath,
      directAccessId,
      logicalPathLength: logicalPath.length,
      created: new Date().toISOString(),
    }

    // // console.log('create', { partRawDbRecord })
    const { new: newRawDbRecord } = await BucketCollection.save(dbRecordData, {
      returnNew: true,
    }).catch(async err => {
      await rimraf(fsFileAbsolutePath, { maxRetries: 10 })
      throw err
    })
    assert(newRawDbRecord, `couldn't store in DB, shouldn't happen !`)

    await writeFile(rpcFileName(fsFileAbsolutePath), JSON.stringify(newRawDbRecord.rpcFile), {
      encoding: 'utf-8',
    })

    const newFsItem = getFsItem(newRawDbRecord)
    return newFsItem
  }

  function rpcFileName(filename: string) {
    return `${filename}_rpc_file`
  }

  async function del(logicalName: string): Promise<null | FsItem> {
    const maybeRawDbRecord = (
      await db
        .query<DbRecord>(
          `FOR fileRecord in @@BucketCollection
                FILTER fileRecord.logicalName == @logicalName
                LIMIT 1
                REMOVE fileRecord IN @@BucketCollection
              RETURN OLD`,
          { logicalName, '@BucketCollection': BucketCollection.name },
        )
        .then(_ => _.all())
    )[0]
    if (!maybeRawDbRecord) {
      return null
    }
    const rawDbRecord = maybeRawDbRecord

    const fsFileAbsolutePath = getFsAbsolutePathByDirectAccessId(rawDbRecord.directAccessId)
    const fsFileMetaAbsolutePath = rpcFileName(fsFileAbsolutePath)
    console.log(`del ${logicalName}`, { maybeRawDbRecord, fsFileAbsolutePath })

    await Promise.all([
      rimraf(fsFileMetaAbsolutePath, { maxRetries: 3 }).catch(() => false),
      rimraf(fsFileAbsolutePath, { maxRetries: 3 }).catch(() => false),
    ])

    let _curr_dir = fsFileAbsolutePath
    do {
      _curr_dir = resolve(_curr_dir, '..')
      const files = await readdir(_curr_dir).catch(() => [])
      if (files.length) {
        break
      }
      const doBreak = await rmdir(_curr_dir).catch(() => true)
      if (doBreak) {
        break
      }
    } while (_curr_dir !== storeBaseFsFolder)

    return getNonReadableFsItem(rawDbRecord)
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
    const { baseUrl } = await mountApp({
      getApp(express) {
        console.log(`getApp [${path}] for ${shell.myId.name}`)
        const basePathApp = express()
        const app = express()
        app.use((req, _res, next) => {
          console.log({ storeBaseFsFolder, path, url: req.url })
          next()
        })
        // basePathApp.use((req, _res, next) => {
        //   console.log(`basePathApp[${path}] for ${shell.myId.name} req:${req.url}`)
        //   next()
        // })
        basePathApp.use(path, app)
        // app.use(path, express.static(storeBaseFsFolder, {}))
        app.use(path, express.static(storeBaseFsFolder, {}))
        return app //basePathApp
      },
    })
    return {
      getFileUrl({ directAccessId }: { directAccessId: string }) {
        return `${baseUrl}${path}/${directAccessId}`
      },
    }
  }

  function getFsItem(rawDbRecord: DbRecordData): FsItem {
    const fsItem = getNonReadableFsItem(rawDbRecord)
    readableRpcFileBydirectAccessId(fsItem.rpcFile, rawDbRecord.directAccessId)
    return fsItem
  }
}

function newFsFileRelativePath(filename: string) {
  const now = new Date()
  return [
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
    String(now.getUTCHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
    filename,
  ]
}
function getSanitizedFileName(originalFilename: string) {
  const sanitized = sanitizeFilename(originalFilename)
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/^[_-]+/, '')
    .replace(/[_-]+$/, '')
    .replace(/[_-]+/g, '_')

  const rnd = String(Math.random()).substring(2, 5)
  return `${rnd}_${sanitized}`
  // originalFilename.normalize("NFD").replace(/\p{Diacritic}/gu, "")
  // const origExt = originalFilename.split('.').pop()
  // const mDotExt = origExt ? `.${origExt}` : ''
  // String(Math.random()).substring(2, 20) + mDotExt
}

function getLogicalPath(logicalName: string) {
  return logicalName ? logicalName.split('/') : []
}

function getNonReadableFsItem(rawDbRecord: DbRecordData): FsItem {
  return {
    created: rawDbRecord.created,
    logicalName: rawDbRecord.logicalName,
    rpcFile: rawDbRecord.rpcFile,
    directAccessId: rawDbRecord.directAccessId,
  }
}
