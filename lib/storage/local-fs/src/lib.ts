import { domainFsDirectories, ensureTempFile, resizeTempImage } from '@moodle/lib-domain-fs'
import { useTempFileResult } from '@moodle/lib-domain-fs'
import { dirPath, path } from '@moodle/lib-types'
import { mkdir, readdir, rename } from 'fs/promises'
import { join, normalize, sep as os_path_separator } from 'path'
import { rimraf } from 'rimraf'
import { localStorageFsDirectories } from './types'

function absolutePathOf({ path, fsDirs }: { path: path; fsDirs: localStorageFsDirectories }) {
  const absolute_path = [fsDirs.storageDir, ...path].join(os_path_separator)
  return absolute_path
}

export function getDefaultLocalFsStorageDirectory({ domainFsDirectories }: { domainFsDirectories: domainFsDirectories }) {
  const localFsStorageDirectory = join(domainFsDirectories.currentDomainDir, 'local-fs-storage')
  return localFsStorageDirectory
}
export async function useTempFileAsWebImage({
  tempId,
  path,
  maxSizePixel,
  fsDirs,
}: {
  tempId: string
  path: path
  maxSizePixel: number
  fsDirs: localStorageFsDirectories
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
  const use_temp_file_result = await useTempFile({
    tempId: resizeResult.resizedTempId,
    path,
    fsDirs,
  })
  return use_temp_file_result
}

export async function createDir({ dirPath, fsDirs }: { dirPath: dirPath; fsDirs: localStorageFsDirectories }) {
  const absolutePath = absolutePathOf({ path: dirPath, fsDirs })
  return mkdir(absolutePath, { recursive: true }).then(
    () => true,
    () => false,
  )
}

export async function useTempFile({
  tempId,
  path,
  fsDirs,
}: {
  tempId: string
  path: path
  fsDirs: localStorageFsDirectories
}): Promise<useTempFileResult> {
  const temp_file = await ensureTempFile({ tempId, fsDirs })
  if (!temp_file) {
    return [false, { reason: 'tempNotFound' }]
  }
  const useInAbsolutePath = absolutePathOf({ path: path, fsDirs })
  await rimraf(useInAbsolutePath, { maxRetries: 2 }).catch(() => null)
  await mkdir(useInAbsolutePath, { recursive: true })

  const mvError = await rename(temp_file.temp_paths.file, join(useInAbsolutePath, temp_file.fileMeta.name)).then(
    () => false as const,
    e => String(e),
  )
  // console.log('use_temp_file', { mvError, tempId, absolutePath })

  if (mvError) {
    return [false, { reason: 'move', error: mvError }]
  }
  const { fileMeta } = temp_file
  return [true, { path, fileMeta }]
}

export async function deleteStorageFile({ path, fsDirs }: { path: path; fsDirs: localStorageFsDirectories }): Promise<void> {
  const absolutePath = absolutePathOf({ path, fsDirs })
  //_and_clean_upper_empty_dirs
  //TODO: ensure this check is enough to avoid climbing up too much !
  if (normalize(fsDirs.storageDir).startsWith(normalize(absolutePath))) {
    return
  }
  await rimraf(absolutePath, { maxRetries: 2 }).catch(() => null)
  const parent_dir_path = path.slice(0, path.length - 1)
  const parentDirAbsolutePath = absolutePathOf({ path: parent_dir_path, fsDirs })
  const parent_dir_files = await readdir(parentDirAbsolutePath).catch(() => [
    `placeholder in case of (unlikely) readdir error`,
    `to prevent deleting this dir, as it's not ensured to be empty`,
  ])
  if (parent_dir_files.length > 0) {
    return
  }
  return deleteStorageFile({ path: parent_dir_path, fsDirs })
}
