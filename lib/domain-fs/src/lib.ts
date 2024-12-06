import { decodeUlid, generateUlid } from '@moodle/lib-id-gen'
import { fileAssetMeta, fileHashes, fileMeta, isNotFalsy, ok_ko, uploadedFileMeta } from '@moodle/lib-types'
import { createHash } from 'crypto'
import { createReadStream } from 'fs'
import { readdir, readFile, stat, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { rimraf } from 'rimraf'
import sanitize_filename from 'sanitize-filename'
import sharp from 'sharp'
import { Readable } from 'stream'
import { domainFsDirectories, tempFilePaths } from './types'

export const MOODLE_DEFAULT_HOME_DIR = '.moodle.home'

export function getDomainFsDirectories({
  domainName,
  homeDir,
}: {
  homeDir: string
  domainName: string
}): domainFsDirectories {
  const currentDomainDir = resolve(homeDir, sanitizeFilename(domainName))
  const temp = join(currentDomainDir, '.temp')
  return {
    currentDomainDir,
    temp,
  }
}

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

export function getTempFilePaths({ tempId, fsDirs }: { tempId: string; fsDirs: domainFsDirectories }): tempFilePaths {
  const file = join(fsDirs.temp, tempId)
  const meta = `${file}.meta.json`
  return { file, meta }
}

export async function deleteTemp({ tempId, fsDirs }: { tempId: string; fsDirs: domainFsDirectories }) {
  const { file: temp_file_path } = getTempFilePaths({ tempId, fsDirs })
  await rimraf(`${temp_file_path}*`, { maxRetries: 2 }).catch(() => null)
}

export async function createTempFile({
  fsDirs,
  readable,
  fileMeta,
  uploadedFileMeta,
  expiresSeconds,
}: {
  fsDirs: domainFsDirectories
  readable: Readable
  fileMeta: fileMeta
  uploadedFileMeta: null | uploadedFileMeta
  expiresSeconds: number
}) {
  const sanitizedFilename = sanitizeFilename(fileMeta.name)
  const ulid = await generateUlid({ onDate: new Date().valueOf() + expiresSeconds * 1000 })
  const tempId = `${ulid}_${sanitizedFilename}`
  const temp_paths = getTempFilePaths({ tempId, fsDirs })
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

export async function ensureTempFile({ tempId, fsDirs }: { tempId: string; fsDirs: domainFsDirectories }) {
  const temp_paths = getTempFilePaths({ tempId, fsDirs })

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

export async function resizeTempImage({
  maxSizePixel,
  tempId,
  fsDirs,
}: {
  tempId: string
  maxSizePixel: number
  fsDirs: domainFsDirectories
}): Promise<
  ok_ko<{ resizedTempId: string; resizedTempFilePaths: tempFilePaths }, { tempNotFound: unknown; invalidFile: unknown }>
> {
  const original_temp_file = await ensureTempFile({ tempId, fsDirs })
  if (!original_temp_file) {
    return [false, { reason: 'tempNotFound' }]
  }

  original_temp_file.temp_paths.file

  const resizedTempId = `${tempId}_${maxSizePixel}`
  const resizedTempFilePaths = getTempFilePaths({ tempId: resizedTempId, fsDirs })
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

export async function deleteStaleTemp({ fsDirs }: { fsDirs: domainFsDirectories }) {
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
