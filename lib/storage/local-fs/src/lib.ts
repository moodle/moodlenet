import { createTempFileReferenceNames, ensureTempWithUploadedMeta, resizeUploadedTempImage, useTempFileResult } from '@moodle/lib-temp-dir'
import { d_u, path } from '@moodle/lib-types'
import { Either, isLeft, left, right } from 'fp-ts/Either'
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
}): Promise<Either<d_u<{ notFoundInStorage: unknown; error: { error: unknown } }, 'reason'>, { tempId: string }>> {
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
    return left({ reason: 'notFoundInStorage' })
  }
  try {
    await symlink(storedAssetAbsolutePath, tempPaths.file)
  } catch (error) {
    return left({ reason: 'error', error })
  }

  return right({ tempId })
}

export function getDefaultLocalFsStorageDirectory({ currentDomainDir }: Pick<localStorageFsDirectories, 'currentDomainDir'>) {
  const localFsStorageDirectory = join(currentDomainDir, 'local-fs-storage')
  return localFsStorageDirectory
}

export async function useUlpoadedTempFileAsWebImage({
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
  const resizeResult = await resizeUploadedTempImage({
    maxSizePixel,
    tempId,
    tempDir: localStorageFsDirectories.tempDir,
  })
  // console.log({ resizeDone, resizeResult })
  if (isLeft(resizeResult)) {
    return resizeResult
  }
  const use_temp_file_result = await useUploadedTempFile({
    tempId: resizeResult.right.resizedTempId,
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

export async function useUploadedTempFile({
  tempId,
  path,
  localStorageFsDirectories,
}: {
  tempId: string
  path: path
  localStorageFsDirectories: localStorageFsDirectories
}): Promise<useTempFileResult> {
  const ensuredTemp = await ensureTempWithUploadedMeta({ tempId, tempDir: localStorageFsDirectories.tempDir })
  if (!ensuredTemp) {
    return left({ reason: 'tempNotFound' })
  }
  const useInAbsoluteDirPath = absoluteDirPathOf({ path, localStorageFsDirectories })
  await rimraf(useInAbsoluteDirPath, { maxRetries: 2 }).catch(() => null)
  await mkdir(useInAbsoluteDirPath, { recursive: true })

  const mvError = await rename(ensuredTemp.paths.file, join(useInAbsoluteDirPath, ensuredTemp.uploadedFileMeta.name)).then(
    () => false as const,
    e => String(e),
  )
  // console.log.use_temp_file({ mvError, tempId, absolutePath })

  if (mvError) {
    return left({ reason: 'move', error: mvError })
  }
  const { uploadedFileMeta: fileMeta } = ensuredTemp
  return right({ path, fileMeta })
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
