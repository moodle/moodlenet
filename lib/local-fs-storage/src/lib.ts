import { moodlePrimary, secondaryContext, storage } from '@moodle/domain'
import {
  asset,
  assetRecord,
  createPathProxy,
  ok_ko,
  path,
  url_path_string_schema,
} from '@moodle/lib-types'
import { mkdir, readFile, rename, stat, writeFile } from 'fs/promises'
import { join, resolve, sep } from 'path'
import { rimraf } from 'rimraf'
import sharp from 'sharp'
import { filesystem, fs, fsDirectories, fsUrlPathGetter } from './types'

import { createHash } from 'crypto'
import { createReadStream } from 'fs'

export const MOODLE_DEFAULT_HOME_DIR = '.moodle.home'

export async function generateFileHashes(filePath: string): Promise<storage.fileHashes> {
  const sha256 = await new Promise<string>((resolve, reject) => {
    const hash = createHash('sha256')
    const rs = createReadStream(filePath)
    rs.on('error', reject)
    rs.on('data', chunk => hash.update(chunk))
    rs.on('end', () => resolve(hash.digest('hex')))
  })
  return {
    sha256,
  }
}

export function prefixed_domain_file_fs_paths(prefix: path | string) {
  const _prefix = [prefix].flat()
  const prefixed_domain_file_paths = createPathProxy<fs<filesystem, fsUrlPathGetter>>({
    apply({ path }) {
      const _path = [..._prefix, ...path].join(sep)
      return url_path_string_schema.parse(_path)
    },
  })
  return prefixed_domain_file_paths
}

export function getFsDirectories({
  domainName,
  homeDir,
}: {
  homeDir: string
  domainName: string
}): fsDirectories {
  const currentDomainDir = resolve(homeDir, storage.getSanitizedFileName(domainName))
  const temp = join(currentDomainDir, '.temp')
  const fsStorage = join(currentDomainDir, 'fs-storage')
  return {
    currentDomainDir,
    temp,
    fsStorage,
  }
}

export function provide_assetRecord2asset(moodlePrimary: moodlePrimary, assetRecord: assetRecord) {
  const prefixed_domain_file_paths = createPathProxy<fs<filesystem, () => Promise<asset>>>({
    async apply({ path }) {
      if (assetRecord.type === 'external') {
        return {
          type: 'external',
          url: assetRecord.url,
          credits: assetRecord.credits,
        }
      } else if (assetRecord.type === 'uploaded') {
        const { filestoreHttp } = await moodlePrimary.env.application.deployments()
        const url = url_path_string_schema.parse(
          [filestoreHttp.href, ...path, assetRecord.uploadMeta.name].join('/'),
        )
        return {
          type: 'uploaded',
          url,
        }
      }
      throw new Error(`Invalid assetRecord type ${JSON.stringify(assetRecord)}`)
    },
  })
  return prefixed_domain_file_paths
}

// export function file_server_domain_file_url({ primary }: { primary: moodlePrimary }) {
//   const prefixed_domain_file_paths = createPathProxy<fs<filesystem, fsUrlPathGetter>>({
//     async apply({ path }) {
//       const { filestoreHttp } = await primary.env.application.deployments()
//       const _path = [filestoreHttp.href, ...path].join('/')
//       return url_path_string_schema.parse(_path)
//     },
//   })
//   return prefixed_domain_file_paths
// }

type temp_file_paths = {
  file: string
  meta: string
}

export function get_temp_file_paths({
  tempId,
  fsDirs,
}: {
  tempId: string
  fsDirs: fsDirectories
}): temp_file_paths {
  const file = join(fsDirs.temp, tempId)
  const meta = `${file}.json`
  return { file, meta }
}

export async function deleteTemp({ tempId, fsDirs }: { tempId: string; fsDirs: fsDirectories }) {
  const { file: temp_file_path } = get_temp_file_paths({ tempId, fsDirs })
  await rimraf(`${temp_file_path}*`, { maxRetries: 2 }).catch(() => null)
}

export function fs_storage_path_of({ path, fsDirs }: { path: path; fsDirs: fsDirectories }) {
  const fs_path = [fsDirs.fsStorage, ...path].join(sep)
  return fs_path
}

export async function ensure_temp_file({
  tempId,
  fsDirs,
}: {
  tempId: string
  fsDirs: fsDirectories
}) {
  const temp_paths = get_temp_file_paths({ tempId, fsDirs })

  const meta: storage.uploaded_blob_meta = await readFile(temp_paths.meta, 'utf8')
    .then(JSON.parse)
    .catch(() => null)
  if (!meta) {
    return false
  }
  const file = await stat(temp_paths.file).catch(() => null)
  if (!file) {
    return false
  }
  return { temp_paths, meta, file }
}
export async function use_temp_file_as_web_image({
  tempId,
  destPath,
  size,
  secondaryContext,
  fsDirs,
}: {
  tempId: string
  destPath: string
  size: storage.webImageSize
  secondaryContext: secondaryContext
  fsDirs: fsDirectories
}): Promise<storage.useTempFileAsWebImageResult> {
  const [resizeDone, resizeResult] = await resizeTempImage({
    size,
    tempId,
    secondaryContext,
    fsDirs,
  })
  // console.log({ resizeDone, resizeResult })
  if (!resizeDone) {
    return [false, resizeResult]
  }
  const use_temp_file_result = await use_temp_file({
    tempId: resizeResult.resizedTempId,
    destPath,
    fsDirs,
  })
  return use_temp_file_result
}

export async function use_temp_file({
  tempId,
  destPath,
  fsDirs,
}: {
  tempId: string
  destPath: string
  fsDirs: fsDirectories
}): Promise<storage.useTempFileResult> {
  const temp_file = await ensure_temp_file({ tempId, fsDirs })
  if (!temp_file) {
    return [false, { reason: 'tempNotFound' }]
  }
  await rimraf(destPath, { maxRetries: 2 }).catch(() => null)
  await mkdir(destPath, { recursive: true })

  const mvError = await rename(temp_file.temp_paths.file, join(destPath, temp_file.meta.name)).then(
    () => false as const,
    e => String(e),
  )
  // console.log('use_temp_file', { mvError, tempId, destPath })

  if (mvError) {
    return [false, { reason: 'move', error: mvError }]
  }

  return [true, { blobMeta: temp_file.meta }]
}

export async function resizeTempImage({
  size,
  tempId,
  secondaryContext,
  fsDirs,
}: {
  tempId: string
  size: storage.webImageSize
  secondaryContext: secondaryContext
  fsDirs: fsDirectories
}): Promise<
  ok_ko<
    { resizedTempId: string; resizedTempFilePaths: temp_file_paths },
    { tempNotFound: unknown; invalidImage: unknown }
  >
> {
  const original_temp_file = await ensure_temp_file({ tempId, fsDirs })
  if (!original_temp_file) {
    return [false, { reason: 'tempNotFound' }]
  }
  const {
    configs: { webImageResizes },
  } = await secondaryContext.mod.env.query.modConfigs({ mod: 'storage' })
  const resizeTo = webImageResizes[size]
  original_temp_file.temp_paths.file

  const resizedTempId = `${tempId}_${size}`
  const resizedTempFilePaths = get_temp_file_paths({ tempId: resizedTempId, fsDirs })
  const resizedInfo = await sharp(original_temp_file.temp_paths.file)
    .resize({
      width: resizeTo,
      height: resizeTo,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFile(resizedTempFilePaths.file)
  const resized_temp_meta: storage.uploaded_blob_meta = {
    ...original_temp_file.meta,
    size: resizedInfo.size,
    originalSize: original_temp_file.meta.size,
  }
  await writeFile(resizedTempFilePaths.meta, JSON.stringify(resized_temp_meta), 'utf8')

  return [true, { resizedTempId, resizedTempFilePaths }]
}
// export async function _delete_and_clean_upper_empty_dirs({ fs_path }: { fs_path: string }) {
//   //TODO: ensure this check is enough to avoid climbing up too much !
//   if (normalize(fsDirs.fsStorage).startsWith(normalize(fs_path))) {
//     return
//   }
//   await rimraf(fs_path, { maxRetries: 2 }).catch(() => null)
//   const parent_dir = dirname(fs_path)
//   const parent_dir_files = await readdir(parent_dir).catch(() => [
//     `placeholder in case of (unlikely) readdir error
//       to prevent deleting this dir, as it's not ensured to be empy`,
//   ])
//   if (parent_dir_files.length > 0) {
//     return
//   }
//   return _delete_and_clean_upper_empty_dirs({ fs_path: parent_dir })
// }

//SHAREDLIB: these below should be in some shared lib
