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

export async function getTempFileReadable({ tempId, domainFsDirectories }: { tempId: string; domainFsDirectories: domainFsDirectories }) {
  const { file } = getTempFilePaths({ tempId, domainFsDirectories })
  return createReadStream(file)
}

export function getTempFilePaths({ tempId, domainFsDirectories }: { tempId: string; domainFsDirectories: domainFsDirectories }): tempFilePaths {
  const file = join(domainFsDirectories.temp, tempId)
  const meta = `${file}.meta.json`
  return { file, meta }
}

export async function deleteTemp({ tempId, domainFsDirectories }: { tempId: string; domainFsDirectories: domainFsDirectories }) {
  const { file: temp_file_path } = getTempFilePaths({ tempId, domainFsDirectories })
  await rimraf(`${temp_file_path}*`, { maxRetries: 2 }).catch(() => null)
}

export async function createTempFile({
  domainFsDirectories,
  readable,
  fileName,
  expiresSeconds,
}: {
  domainFsDirectories: domainFsDirectories
  readable: Readable
  fileName: string
  expiresSeconds: number
}) {
  const sanitizedFilename = sanitizeFilename(fileName)
  const ulid = await generateUlid({ onDate: new Date().valueOf() + expiresSeconds * 1000 })
  const tempId = `${ulid}_${sanitizedFilename}`
  const tempPaths = getTempFilePaths({ tempId, domainFsDirectories })
  await writeFile(tempPaths.file, readable)
  return { tempId, tempPaths, sanitizedFilename }
}

export async function createUploadedTempFile({
  domainFsDirectories,
  readable,
  uploadedFileMeta,
  expiresSeconds,
}: {
  domainFsDirectories: domainFsDirectories
  readable: Readable
  uploadedFileMeta: fileMeta
  expiresSeconds: number
}) {
  const { tempId, tempPaths, sanitizedFilename } = await createTempFile({
    expiresSeconds,
    fileName: uploadedFileMeta.name,
    domainFsDirectories,
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

export async function ensureTempWithMeta({ tempId, domainFsDirectories }: { tempId: string; domainFsDirectories: domainFsDirectories }) {
  const ensuredTempFile = await ensureTemp({ tempId, domainFsDirectories })
  if (!ensuredTempFile) {
    return false
  }

  const fileMeta: fileMeta = await readFile(ensuredTempFile.paths.meta, 'utf8')
    .then(JSON.parse)
    .catch(() => null)
  if (!fileMeta) {
    return false
  }
  return { ...ensuredTempFile, fileMeta }
}
export async function ensureTemp({ tempId, domainFsDirectories }: { tempId: string; domainFsDirectories: domainFsDirectories }) {
  const paths = getTempFilePaths({ tempId, domainFsDirectories })

  const file = await stat(paths.file).catch(() => null)
  if (!file) {
    return false
  }
  return { paths, file }
}

export async function resizeTempImage({
  maxSizePixel,
  tempId,
  domainFsDirectories,
}: {
  tempId: string
  maxSizePixel: number
  domainFsDirectories: domainFsDirectories
}): Promise<ok_ko<{ resizedTempId: string; resizedPaths: tempFilePaths }, { tempNotFound: unknown; invalidFile: unknown }>> {
  const original_temp_file = await ensureTempWithMeta({ tempId, domainFsDirectories })
  if (!original_temp_file) {
    return [false, { reason: 'tempNotFound' }]
  }

  const resizedTempId = `${tempId}_${maxSizePixel}`
  const resizedpaths = getTempFilePaths({ tempId: resizedTempId, domainFsDirectories })
  const resizedInfo = await sharp(original_temp_file.paths.file)
    .resize({
      width: maxSizePixel,
      height: maxSizePixel,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFile(resizedpaths.file)
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
  await writeFile(resizedpaths.meta, JSON.stringify(resized_temp_fileMeta), 'utf8')

  return [true, { resizedTempId, resizedPaths: resizedpaths }]
}

export async function deleteStaleTemp({ domainFsDirectories }: { domainFsDirectories: domainFsDirectories }) {
  const { temp } = domainFsDirectories
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
