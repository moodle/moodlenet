import { decodeUlid, generateUlid } from '@moodle/lib-id-gen'
import { dirPath, isNotFalsy, ok_ko, path } from '@moodle/lib-types'
import {
  asset,
  fileAssetMeta,
  fileHashes,
  fileMeta,
  storedAssetMeta,
  uploadedFileMeta,
  useTempFileResult,
} from '@moodle/module/storage'
import { createHash } from 'crypto'
import { createReadStream } from 'fs'
import { mkdir, readdir, readFile, rename, stat, writeFile } from 'fs/promises'
import { join, normalize, sep as os_path_separator, resolve } from 'path'
import { rimraf } from 'rimraf'
import sanitize_filename from 'sanitize-filename'
import sharp from 'sharp'
import { Readable } from 'stream'
import { localFsDirectories } from './types'

export function sanitizeFilename(originalFilename: string) {
  const sanitized = sanitize_filename(originalFilename)
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/^[_-]+/, '')
    .replace(/[_-]+$/, '')
    .replace(/[_-]+/g, '_')

  return sanitized
  // originalFilename.normalize("NFD").replace(/\p{Diacritic}/gu, "")
  // const origExt = originalFilename.split('.').pop()
  // const mDotExt = origExt ? `.${origExt}` : ''
}

export function getRndPrefixedSanitizedFileName(originalFilename: string, prefixLength = 3) {
  const rnd = String(Math.random()).substring(2, 2 + prefixLength)
  return `${rnd}_${sanitizeFilename(originalFilename)}`
}

export const MOODLE_DEFAULT_HOME_DIR = '.moodle.home'

export async function generateFileHashes(filePath: string): Promise<fileHashes> {
  return await generateHashes(createReadStream(filePath))
}

export async function generateHashes(readable: Readable): Promise<fileHashes> {
  const sha256 = await new Promise<string>((resolve, reject) => {
    const hash = createHash('sha256')
    readable.on('error', reject)
    readable.on('data', chunk => hash.update(chunk))
    readable.on('end', () => resolve(hash.digest('hex')))
  })
  return {
    sha256,
  }
}

export function getFsDirectories({ domainName, homeDir }: { homeDir: string; domainName: string }): localFsDirectories {
  const currentDomainDir = resolve(homeDir, sanitizeFilename(domainName))
  const temp = join(currentDomainDir, '.temp')
  const fsStorage = join(currentDomainDir, 'fs-storage')
  return {
    currentDomainDir,
    temp,
    fsStorage,
  }
}

type temp_file_paths = {
  file: string
  meta: string
}

export function get_temp_file_paths({ tempId, fsDirs }: { tempId: string; fsDirs: localFsDirectories }): temp_file_paths {
  const file = join(fsDirs.temp, tempId)
  const meta = `${file}.meta.json`
  return { file, meta }
}

export async function deleteTemp({ tempId, fsDirs }: { tempId: string; fsDirs: localFsDirectories }) {
  const { file: temp_file_path } = get_temp_file_paths({ tempId, fsDirs })
  await rimraf(`${temp_file_path}*`, { maxRetries: 2 }).catch(() => null)
}

// FIXME: this may not be exported
function absolute_path_of({ path, fsDirs }: { path: path; fsDirs: localFsDirectories }) {
  const absolute_path = [fsDirs.fsStorage, ...path].join(os_path_separator)
  return absolute_path
}

export async function create_temp_file({
  fsDirs,
  readable,
  fileMeta,
  uploadedFileMeta,
  expiresSeconds,
}: {
  fsDirs: localFsDirectories
  readable: Readable
  fileMeta: fileMeta
  uploadedFileMeta: null | uploadedFileMeta
  expiresSeconds: number
}) {
  const sanitizedFilename = sanitizeFilename(fileMeta.name)
  const ulid = await generateUlid({ onDate: new Date().valueOf() + expiresSeconds * 1000 })
  const tempId = `${ulid}_${sanitizedFilename}`
  const temp_paths = get_temp_file_paths({ tempId, fsDirs })
  await writeFile(temp_paths.file, readable)

  const fileAssetMeta: fileAssetMeta = {
    hash: await generateFileHashes(temp_paths.file),
    name: sanitizedFilename,
    mimetype: fileMeta.mimetype, // get it from actual writed file
    size: fileMeta.size,
    uploaded: uploadedFileMeta,
  }
  await writeFile(temp_paths.meta, JSON.stringify(fileAssetMeta), 'utf8')
  return { tempId, fileAssetMeta }
}
async function ensure_temp_file({ tempId, fsDirs }: { tempId: string; fsDirs: localFsDirectories }) {
  const temp_paths = get_temp_file_paths({ tempId, fsDirs })

  const fileAssetMeta: fileAssetMeta = await readFile(temp_paths.meta, 'utf8')
    .then(JSON.parse)
    .catch(() => null)
  if (!fileAssetMeta) {
    return false
  }
  const file = await stat(temp_paths.file).catch(() => null)
  if (!file) {
    return false
  }
  return { temp_paths, fileAssetMeta, file }
}
export async function use_temp_file_as_web_image({
  tempId,
  path,
  maxSizePixel,
  fsDirs,
}: {
  tempId: string
  path: path
  maxSizePixel: number
  fsDirs: localFsDirectories
}): Promise<useTempFileResult> {
  const [resizeDone, resizeResult] = await resizeTempImage({
    maxSizePixel,
    tempId,
    fsDirs,
  })
  // console.log({ resizeDone, resizeResult })
  if (!resizeDone) {
    return [false, resizeResult]
  }
  const use_temp_file_result = await use_temp_file({
    tempId: resizeResult.resizedTempId,
    path,
    fsDirs,
  })
  return use_temp_file_result
}
export async function createDir({ dirPath, fsDirs }: { dirPath: dirPath; fsDirs: localFsDirectories }) {
  const absolutePath = absolute_path_of({ path: dirPath, fsDirs })
  return mkdir(absolutePath, { recursive: true }).then(
    () => true,
    () => false,
  )
}
export async function use_temp_file({
  tempId,
  path,
  fsDirs,
}: {
  tempId: string
  path: path
  fsDirs: localFsDirectories
}): Promise<useTempFileResult> {
  const temp_file = await ensure_temp_file({ tempId, fsDirs })
  if (!temp_file) {
    return [false, { reason: 'tempNotFound' }]
  }
  const useInAbsolutePath = absolute_path_of({ path: path, fsDirs })
  await rimraf(useInAbsolutePath, { maxRetries: 2 }).catch(() => null)
  await mkdir(useInAbsolutePath, { recursive: true })

  const mvError = await rename(temp_file.temp_paths.file, join(useInAbsolutePath, temp_file.fileAssetMeta.name)).then(
    () => false as const,
    e => String(e),
  )
  // console.log('use_temp_file', { mvError, tempId, absolutePath })

  if (mvError) {
    return [false, { reason: 'move', error: mvError }]
  }
  const { fileAssetMeta } = temp_file
  const asset = usingTempFile2asset({ path: path, fileAssetMeta })
  return [true, { fileAssetMeta, asset }]
}

export function usingTempFile2asset({
  path,
  fileAssetMeta,
}: {
  fileAssetMeta: fileAssetMeta
  path: path //
}) {
  const asset: asset = {
    type: 'stored',
    path,
    hash: fileAssetMeta.hash,
    uploaded: fileAssetMeta.uploaded,
    mimetype: fileAssetMeta.mimetype,
    name: fileAssetMeta.name,
    size: fileAssetMeta.size,
  }
  return asset
}

export async function getReadableLocalAsset({
  fsDirs,
  localAssetMeta,
}: {
  fsDirs: localFsDirectories
  localAssetMeta: Pick<storedAssetMeta, 'path'>
}): Promise<Readable> {
  const localFileAbsolutePath = absolute_path_of({ path: localAssetMeta.path, fsDirs })
  // TODO: check for existence ..
  return createReadStream(localFileAbsolutePath)
}

export async function resizeTempImage({
  maxSizePixel,
  tempId,
  fsDirs,
}: {
  tempId: string
  maxSizePixel: number
  fsDirs: localFsDirectories
}): Promise<
  ok_ko<{ resizedTempId: string; resizedTempFilePaths: temp_file_paths }, { tempNotFound: unknown; invalidFile: unknown }>
> {
  const original_temp_file = await ensure_temp_file({ tempId, fsDirs })
  if (!original_temp_file) {
    return [false, { reason: 'tempNotFound' }]
  }

  original_temp_file.temp_paths.file

  const resizedTempId = `${tempId}_${maxSizePixel}`
  const resizedTempFilePaths = get_temp_file_paths({ tempId: resizedTempId, fsDirs })
  const resizedInfo = await sharp(original_temp_file.temp_paths.file)
    .resize({
      width: maxSizePixel,
      height: maxSizePixel,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFile(resizedTempFilePaths.file)
  const resized_temp_fileAssetMeta: fileAssetMeta = {
    ...original_temp_file.fileAssetMeta,
    hash: await generateFileHashes(resizedTempFilePaths.file),
    size: resizedInfo.size,
    uploaded: original_temp_file.fileAssetMeta.uploaded && {
      ...original_temp_file.fileAssetMeta.uploaded,
      original: {
        size: original_temp_file.fileAssetMeta.size,
        hash: original_temp_file.fileAssetMeta.hash,
        name: original_temp_file.fileAssetMeta.name,
      },
    },
  }
  //   ...original_temp_file.meta,
  //   size: resizedInfo.size,
  //   original: {
  //     ...original_temp_file.meta.original,
  //     size: original_temp_file.meta.size,
  //   },
  // }
  await writeFile(resizedTempFilePaths.meta, JSON.stringify(resized_temp_fileAssetMeta), 'utf8')

  return [true, { resizedTempId, resizedTempFilePaths }]
}

export async function deleteStorageFile({ path, fsDirs }: { path: path; fsDirs: localFsDirectories }): Promise<void> {
  const absolutePath = absolute_path_of({ path, fsDirs })
  //_and_clean_upper_empty_dirs
  //TODO: ensure this check is enough to avoid climbing up too much !
  if (normalize(fsDirs.fsStorage).startsWith(normalize(absolutePath))) {
    return
  }
  await rimraf(absolutePath, { maxRetries: 2 }).catch(() => null)
  const parent_dir_path = path.slice(0, path.length - 1)
  const parentDirAbsolutePath = absolute_path_of({ path: parent_dir_path, fsDirs })
  const parent_dir_files = await readdir(parentDirAbsolutePath).catch(() => [
    `placeholder in case of (unlikely) readdir error`,
    `to prevent deleting this dir, as it's not ensured to be empty`,
  ])
  if (parent_dir_files.length > 0) {
    return
  }
  return deleteStorageFile({ path: parent_dir_path, fsDirs })
}

export async function deleteStaleTemp({ fsDirs }: { fsDirs: localFsDirectories }) {
  const { temp } = fsDirs
  const temp_dir_content = await readdir(temp)
  const deletedFiles = await Promise.all(
    temp_dir_content.map(async temp_dir_content_name => {
      const temp_dir_content_path = join(temp, temp_dir_content_name)
      const now_millis = Date.now().valueOf()
      const m_ulid_expires_string = temp_dir_content_name.split('_')[0]
      const expires_date_millis = m_ulid_expires_string ? decodeUlid(m_ulid_expires_string) : null

      const expired = (expires_date_millis || now_millis) <= now_millis
      if (!expired) {
        return
      }
      rimraf(temp_dir_content_path, { maxRetries: 2 })
      return {
        deletedFile: temp_dir_content_path,
        invalidUlid: !expires_date_millis,
      }
    }),
  )
  //setTimeout(cleanupTemp, tempFileMaxRetentionMilliseconds)
  return deletedFiles.filter(isNotFalsy)
}
