import { decodeUlid, generateUlid } from '@moodle/lib-id-gen'
import { d_u, isNotFalsy } from '@moodle/lib-types'
import { Either, left, right } from 'fp-ts/Either'
import { createReadStream } from 'fs'
import { readdir, readFile, stat, writeFile } from 'fs/promises'
import { join } from 'path'
import { rimraf } from 'rimraf'
import sanitize_filename from 'sanitize-filename'
import sharp from 'sharp'
import { finished, Readable } from 'stream'
import { tempFilePaths, uploadedFileMeta } from './types'

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

// tempDir
// export function gettempDir({
//   domainName,
//   homeDir,
// }: {
//   homeDir: string
//   domainName: string
// }): tempDir {
//   const currentDomainDir = resolve(homeDir, sanitizeFilename(domainName))
//   const temp = join(currentDomainDir, '.temp')
//   return {
//     currentDomainDir,
//     temp,
//   }
// }

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

export async function getTempFileReadable({ tempId, tempDir }: { tempId: string; tempDir: string }) {
  const { file } = getTempFilePaths({ tempId, tempDir })
  const readable = createReadStream(file)
  finished(readable, { error: true, readable: true }, () => deleteTempFile({ tempId, tempDir }))
  return readable
}

export function getTempFilePaths({ tempId, tempDir }: { tempId: string; tempDir: string }): tempFilePaths {
  const file = join(tempDir, tempId)
  const uploadedFileMeta = `${file}.uploadedFileMeta.json`
  return { file, uploadedFileMeta }
}

export async function deleteTempFile({ tempId, tempDir }: { tempId: string; tempDir: string }) {
  const { file: temp_file_path } = getTempFilePaths({ tempId, tempDir })
  await rimraf(`${temp_file_path}*`, { maxRetries: 2 }).catch(() => null)
}

export async function createTempFileReferenceNames({ tempDir, fileName, expiresSeconds }: { tempDir: string; fileName: string; expiresSeconds: number }) {
  const sanitizedFilename = sanitizeFilename(fileName)
  const ulid = generateUlid({ onDate: new Date().valueOf() + expiresSeconds * 1000 })
  const tempId = `${ulid}_${sanitizedFilename}`
  const tempPaths = getTempFilePaths({ tempId, tempDir })
  return { tempPaths, tempId, sanitizedFilename }
}

export async function createTempFile({ tempDir, readable, fileName, expiresSeconds }: { tempDir: string; readable: Readable; fileName: string; expiresSeconds: number }) {
  const { tempPaths, sanitizedFilename, tempId } = await createTempFileReferenceNames({
    tempDir,
    expiresSeconds,
    fileName,
  })
  await writeFile(tempPaths.file, readable)
  return { tempId, tempPaths, sanitizedFilename }
}

export async function createUploadedTempFile({
  tempDir,
  readable,
  // fileMeta,
  expiresSeconds,
  uploadedFileMeta,
}: {
  tempDir: string
  readable: Readable
  // fileMeta: fileMeta
  uploadedFileMeta: uploadedFileMeta
  expiresSeconds: number
}) {
  const { tempId, tempPaths, sanitizedFilename } = await createTempFile({
    expiresSeconds,
    fileName: uploadedFileMeta.name,
    tempDir,
    readable,
  })
  const sanitzedUploadedFileMeta: uploadedFileMeta = {
    ...uploadedFileMeta,
    name: sanitizedFilename,
  }
  await writeFile(tempPaths.uploadedFileMeta, JSON.stringify(sanitzedUploadedFileMeta), 'utf8')
  return { tempId, uploadedFileMeta }
}

export async function ensureTempWithUploadedMeta({ tempId, tempDir }: { tempId: string; tempDir: string }) {
  const ensuredTempFile = await ensureTemp({ tempId, tempDir })
  if (!ensuredTempFile) {
    return false
  }

  const uploadedFileMeta: uploadedFileMeta = await readFile(ensuredTempFile.paths.uploadedFileMeta, 'utf8')
    .then(JSON.parse)
    .catch(() => null)
  if (!uploadedFileMeta) {
    return false
  }
  return { ...ensuredTempFile, uploadedFileMeta }
}
export async function ensureTemp({ tempId, tempDir }: { tempId: string; tempDir: string }) {
  const paths = getTempFilePaths({ tempId, tempDir })

  const file = await stat(paths.file).catch(() => null)
  if (!file) {
    return false
  }
  return { paths, file }
}

export async function resizeUploadedTempImage({
  maxSizePixel,
  tempId,
  tempDir,
}: {
  tempId: string
  maxSizePixel: number
  tempDir: string
}): Promise<Either<d_u<{ tempNotFound: unknown; invalidFile: unknown }, 'reason'>, { resizedTempId: string; resizedPaths: tempFilePaths }>> {
  const original_temp_file = await ensureTempWithUploadedMeta({ tempId, tempDir })
  if (!original_temp_file) {
    return left({ reason: 'tempNotFound' })
  }

  const resizedTempId = `${tempId}_${maxSizePixel}`
  const resizedpaths = getTempFilePaths({ tempId: resizedTempId, tempDir })
  const resizedInfo = await sharp(original_temp_file.paths.file)
    .resize({
      width: maxSizePixel,
      height: maxSizePixel,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFile(resizedpaths.file)
  const resized_temp_fileMeta: uploadedFileMeta = {
    ...original_temp_file.uploadedFileMeta,
    size: resizedInfo.size,
    original: {
      size: original_temp_file.uploadedFileMeta.size,
      name: original_temp_file.uploadedFileMeta.name,
    },
  }
  //   ...original_temp_file.meta,
  //   size: resizedInfo.size,
  //   original: {
  //     ...original_temp_file.meta.original,
  //     size: original_temp_file.meta.size,
  //   },
  // }
  await writeFile(resizedpaths.uploadedFileMeta, JSON.stringify(resized_temp_fileMeta), 'utf8')

  return right({ resizedTempId, resizedPaths: resizedpaths })
}

export async function deleteStaleTemp({ tempDir }: { tempDir: string }) {
  const temp_dir_content = await readdir(tempDir)
  const deletedFiles = await Promise.all(
    temp_dir_content.map(async temp_dir_content_name => {
      const temp_dir_content_path = join(tempDir, temp_dir_content_name)
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
