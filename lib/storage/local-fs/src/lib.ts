import { createTempFileReferenceNames, ensureTempWithMeta, resizeTempImage, useTempFileResult } from '@moodle/lib-temp-dir'
import { ok_ko, path } from '@moodle/lib-types'
import { mkdir, readdir, rename, stat, symlink } from 'fs/promises'
import { join, normalize, sep as os_path_separator } from 'path'
import { rimraf } from 'rimraf'
import { localStorageFsDirectories } from './types'

function absoluteDirPathOf({ path, localStorageFsDirectories }: { path: path; localStorageFsDirectories: localStorageFsDirectories }) {
  const absolute_dir_path = [localStorageFsDirectories.storageDir, ...path].join(os_path_separator)
  return absolute_dir_path
}

export async function createStoredAssetTempFileSymlink({
  storedAssetMeta,
  expiresSeconds,
  localStorageFsDirectories,
}: {
  expiresSeconds: number
  // import { storedAssetMeta } from '@moodle/domain'
  storedAssetMeta: { path: path; name: string } // Pick<storedAssetMeta, 'path' | 'name'>
  localStorageFsDirectories: localStorageFsDirectories
}): Promise<ok_ko<{ tempId: string }, { notFoundInStorage: unknown; error: { error: unknown } }>> {
  const { tempPaths, tempId } = await createTempFileReferenceNames({
    tempDir: localStorageFsDirectories.tempDir,
    expiresSeconds,
    fileName: storedAssetMeta.name,
  })

  const storedAssetAbsolutePath = join(
    absoluteDirPathOf({
      path: storedAssetMeta.path,
      localStorageFsDirectories,
    }),
    storedAssetMeta.name,
  )

  // console.log({ tempPaths, tempId, storedAssetAbsolutePath })
  const targetStats = await stat(storedAssetAbsolutePath).catch(() => null)
  if (!targetStats) {
    return [false, { reason: 'notFoundInStorage' }]
  }
  try {
    await symlink(storedAssetAbsolutePath, tempPaths.file)
  } catch (error) {
    return [false, { reason: 'error', error }]
  }

  return [true, { tempId }]
}

export function getDefaultLocalFsStorageDirectory({ currentDomainDir }: Pick<localStorageFsDirectories, 'currentDomainDir'>) {
  const localFsStorageDirectory = join(currentDomainDir, 'local-fs-storage')
  return localFsStorageDirectory
}

export async function useTempFileAsWebImage({
  tempId,
  path,
  maxSizePixel,
  localStorageFsDirectories,
}: {
  tempId: string
  path: path
  maxSizePixel: number
  localStorageFsDirectories: localStorageFsDirectories
}): Promise<useTempFileResult> {
  const [resizeDone, resizeResult] = await resizeTempImage({
    maxSizePixel,
    tempId,
    tempDir: localStorageFsDirectories.tempDir,
  })
  // console.log({ resizeDone, resizeResult })
  if (!resizeDone) {
    return [false, resizeResult]
  }
  const use_temp_file_result = await useTempFile({
    tempId: resizeResult.resizedTempId,
    path,
    localStorageFsDirectories,
  })
  return use_temp_file_result
}

// export async function createDir({
//   dirPath,
//   localStorageFsDirectories,
// }: {
//   dirPath: dirPath
//   localStorageFsDirectories: localStorageFsDirectories
// }) {
//   const absoluteDirPath = absoluteDirPathOf({ path: dirPath, localStorageFsDirectories })
//   return mkdir(absoluteDirPath, { recursive: true }).then(
//     () => true,
//     () => false,
//   )
// }

export async function useTempFile({
  tempId,
  path,
  localStorageFsDirectories,
}: {
  tempId: string
  path: path
  localStorageFsDirectories: localStorageFsDirectories
}): Promise<useTempFileResult> {
  const ensuredTemp = await ensureTempWithMeta({ tempId, tempDir: localStorageFsDirectories.tempDir })
  if (!ensuredTemp) {
    return [false, { reason: 'tempNotFound' }]
  }
  const useInAbsoluteDirPath = absoluteDirPathOf({ path, localStorageFsDirectories })
  await rimraf(useInAbsoluteDirPath, { maxRetries: 2 }).catch(() => null)
  await mkdir(useInAbsoluteDirPath, { recursive: true })

  const mvError = await rename(ensuredTemp.paths.file, join(useInAbsoluteDirPath, ensuredTemp.fileMeta.name)).then(
    () => false as const,
    e => String(e),
  )
  // console.log.use_temp_file({ mvError, tempId, absolutePath })

  if (mvError) {
    return [false, { reason: 'move', error: mvError }]
  }
  const { fileMeta } = ensuredTemp
  return [true, { path, fileMeta }]
}

export async function deleteStorageFile({ path, localStorageFsDirectories }: { path: path; localStorageFsDirectories: localStorageFsDirectories }): Promise<void> {
  const absoluteDirPath = absoluteDirPathOf({ path, localStorageFsDirectories: localStorageFsDirectories })
  //_and_clean_upper_empty_dirs
  //TODO: ensure this check is enough to avoid climbing up too much !
  if (normalize(localStorageFsDirectories.storageDir).startsWith(normalize(absoluteDirPath))) {
    return
  }
  await rimraf(absoluteDirPath, { maxRetries: 2 }).catch(() => null)
  const parent_dir_path = path.slice(0, path.length - 1)
  const parentDirAbsolutePath = absoluteDirPathOf({
    path: parent_dir_path,
    localStorageFsDirectories: localStorageFsDirectories,
  })
  const parent_dir_files = await readdir(parentDirAbsolutePath).catch(() => [
    `placeholder in case of (unlikely) readdir error`,
    `to prevent deleting this dir, as it's not ensured to be empty`,
  ])
  if (parent_dir_files.length > 0) {
    return
  }
  return deleteStorageFile({ path: parent_dir_path, localStorageFsDirectories: localStorageFsDirectories })
}
