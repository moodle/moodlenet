import { decodeUlid, generateUlid } from '@moodle/lib-id-gen'
import { isNotFalsy, ok_ko } from '@moodle/lib-types'
import { createReadStream } from 'fs'
import { readdir, readFile, stat, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { rimraf } from 'rimraf'
import sanitize_filename from 'sanitize-filename'
import sharp from 'sharp'
import { Readable } from 'stream'
import { domainFsDirectories, fileMeta, tempFilePaths } from './types'

export const MOODLE_DEFAULT_HOME_DIR = '.moodle.home'

// export function generateFileHashes(filePath: string): Promise<fileHashes> {
//   return generateHashes(createReadStream(filePath))
// }

// export async function generateHashes(readable: Readable): Promise<fileHashes> {
//   const sha256 = await new Promise<string>((resolve, reject) => {
//     const hash = createHash('sha256')
//     readable.on('error', reject)
//     readable.on('data', chunk => hash.update(chunk))
//     readable.on('end', () => resolve(hash.digest('hex')))
//   })
//   return {
//     sha256,
//   }
// }

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

export async function getTempFileReadable({ tempId, fsDirs }: { tempId: string; fsDirs: domainFsDirectories }) {
  const { file } = getTempFilePaths({ tempId, fsDirs })
  return createReadStream(file)
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
  fileName,
  expiresSeconds,
}: {
  fsDirs: domainFsDirectories
  readable: Readable
  fileName: string
  expiresSeconds: number
}) {
  const sanitizedFilename = sanitizeFilename(fileName)
  const ulid = await generateUlid({ onDate: new Date().valueOf() + expiresSeconds * 1000 })
  const tempId = `${ulid}_${sanitizedFilename}`
  const tempPaths = getTempFilePaths({ tempId, fsDirs })
  await writeFile(tempPaths.file, readable)
  return { tempId, tempPaths, sanitizedFilename }
}

export async function createUploadedTempFile({
  fsDirs,
  readable,
  uploadedFileMeta,
  expiresSeconds,
}: {
  fsDirs: domainFsDirectories
  readable: Readable
  uploadedFileMeta: fileMeta
  expiresSeconds: number
}) {
  const { tempId, tempPaths, sanitizedFilename } = await createTempFile({
    expiresSeconds,
    fileName: uploadedFileMeta.name,
    fsDirs,
    readable,
  })
  const fileMeta: fileMeta = {
    name: sanitizedFilename,
    mimetype: uploadedFileMeta.mimetype, // get it from actual writed file ?
    size: uploadedFileMeta.size,
    uploaded: uploadedFileMeta.uploaded,
  }
  await writeFile(tempPaths.meta, JSON.stringify(fileMeta), 'utf8')
  return { tempId, fileMeta }
}

export async function ensureTempFile({ tempId, fsDirs }: { tempId: string; fsDirs: domainFsDirectories }) {
  const temp_paths = getTempFilePaths({ tempId, fsDirs })

  const fileMeta: fileMeta = await readFile(temp_paths.meta, 'utf8')
    .then(JSON.parse)
    .catch(() => null)
  if (!fileMeta) {
    return false
  }
  const file = await stat(temp_paths.file).catch(() => null)
  if (!file) {
    return false
  }
  return { temp_paths, fileMeta, file }
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
  const resized_temp_fileMeta: fileMeta = {
    ...original_temp_file.fileMeta,
    size: resizedInfo.size,
    uploaded: original_temp_file.fileMeta.uploaded && {
      ...original_temp_file.fileMeta.uploaded,
      original: {
        size: original_temp_file.fileMeta.size,
        name: original_temp_file.fileMeta.name,
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
  await writeFile(resizedTempFilePaths.meta, JSON.stringify(resized_temp_fileMeta), 'utf8')

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
