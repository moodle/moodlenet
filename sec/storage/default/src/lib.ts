import { secondaryContext, storage } from '@moodle/domain'
import { _void, ok_ko, path } from '@moodle/lib-types'
import { mkdir, readFile, rename, stat, writeFile } from 'fs/promises'
import { dirname, join, sep } from 'path'
import { rimraf } from 'rimraf'
import sharp from 'sharp'
type temp_file_paths = {
  file: string
  meta: string
}

export function get_temp_file_paths({
  tempId,
  fsDirs,
}: {
  tempId: string
  fsDirs: storage.fsDirectories
}): temp_file_paths {
  const file = join(fsDirs.temp, tempId)
  const meta = `${file}.json`
  return { file, meta }
}

export async function deleteTemp({
  tempId,
  fsDirs,
}: {
  tempId: string
  fsDirs: storage.fsDirectories
}) {
  const { file: temp_file_path } = get_temp_file_paths({ tempId, fsDirs })
  await rimraf(`${temp_file_path}*`, { maxRetries: 2 }).catch(() => null)
}

export function fs_storage_path_of({
  path,
  fsDirs,
}: {
  path: path
  fsDirs: storage.fsDirectories
}) {
  const fs_path = [fsDirs.fsStorage, ...path].join(sep)
  return fs_path
}

export async function ensure_temp_file({
  tempId,
  fsDirs,
}: {
  tempId: string
  fsDirs: storage.fsDirectories
}) {
  const temp_paths = get_temp_file_paths({ tempId, fsDirs })

  const meta: storage.temp_blob_meta = await readFile(temp_paths.meta, 'utf8')
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
  fsDirs: storage.fsDirectories
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
  fsDirs: storage.fsDirectories
}): Promise<storage.useTempFileResult> {
  const temp_file = await ensure_temp_file({ tempId, fsDirs })
  if (!temp_file) {
    return [false, { reason: 'tempNotFound' }]
  }
  await mkdir(dirname(destPath), { recursive: true })
  const mvError = await rename(temp_file.temp_paths.file, destPath).then(
    () => false as const,
    e => String(e),
  )
  // console.log('use_temp_file', { mvError, tempId, destPath })

  if (mvError) {
    return [false, { reason: 'move', error: mvError }]
  }

  return [true, _void]
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
  fsDirs: storage.fsDirectories
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
  const resized_temp_meta: storage.temp_blob_meta = {
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
