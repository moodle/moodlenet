import { moodle_secondary_adapter, moodle_secondary_factory, storage } from '@moodle/domain'
import { _void, path, temp_blob_meta } from '@moodle/lib-types'
import { mkdir, readdir, readFile, rename, stat } from 'fs/promises'
import { dirname, join, normalize, sep } from 'path'
import { rimraf } from 'rimraf'
import { startCleanupProcess } from './lib'
import { StorageDefaultSecEnv } from './types'

export function get_storage_default_secondary_factory(
  storageDefaultSecEnv: StorageDefaultSecEnv,
): moodle_secondary_factory {
  // const domainDir = path.join(env_home, 'fs-storage')
  // const fsDirs.temp = path.join(domainDir, '.temp')

  const fsDirs = storage.getFsDirectories(storageDefaultSecEnv)

  //FIXME: set in startbackground processss
  startCleanupProcess(storageDefaultSecEnv)

  return ctx => {
    const fs_file_paths = storage.prefixed_domain_file_paths(fsDirs.fsStorage)
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        userHome: {
          storage: {
            async createUserHome({ userHomeId }) {
              const userHomePath = fs_file_paths.userHome[userHomeId]!()
              await mkdir(userHomePath, { recursive: true })
              return [true, _void]
            },
            async useImageInProfile({ as, id, tempId }) {
              const tmpFile = join(fsDirs.temp, tempId)
              const tmpFileMeta = `${tmpFile}.json`
              // console.log({ tmpFile, tmpFileMeta })
              const meta: temp_blob_meta = await readFile(tmpFileMeta, 'utf8')
                .then(JSON.parse)
                .catch(() => null)
              if (!meta) {
                return [false, { reason: 'tempNotFound' }]
              }
              const file = await stat(tmpFile).catch(() => null)
              if (!file) {
                return [false, { reason: 'tempNotFound' }]
              }

              const destPath = fs_file_paths.userHome[id]!.profile[as]!()
              // console.log({ tmpFile, tmpFileMeta, destPath })

              const mvError = await rename(tmpFile, destPath).then(
                () => false as const,
                e => String(e),
              )
              // console.log({ mvError })

              // console.log({ destPath, mvError, file, meta, tmpFile, tmpFileMeta })
              if (mvError) {
                return [false, { reason: 'unknown', error: mvError }]
              }

              return [true, _void]
            },
          },
        },
        storage: {
          temp: {
            async getTempMeta({ tempId }) {
              const { temp_file_meta_path } = get_temp_file_paths({ tempId })

              const meta: temp_blob_meta = await readFile(temp_file_meta_path, 'utf8')
                .then(JSON.parse)
                .catch(null)

              if (!meta) {
                await deleteTemp({ tempId }).catch(() => null)
                return [false, { reason: 'notFound' }]
              }

              return [true, { meta }] //, temp_file_full_path, temp_file_name, temp_file_dir }
            },
            // async useTempFile({ destPath, tempId }) {
            //   const { temp_file_meta_path } = get_temp_file_paths({ tempId })

            //   const meta: temp_blob_meta = await readFile(temp_file_meta_path, 'utf8')
            //     .then(JSON.parse)
            //     .catch(null)
            //   if (!meta) {
            //     await deleteTemp({ tempId }).catch(() => null)
            //     return [false, { reason: 'notFound' }]
            //   }

            //   const fs_dest_path = path2modFsPath({ path: destPath })
            //   await mkdir(fs_dest_path, { recursive: true })
            //   const { temp_file_path } = get_temp_file_paths({ tempId })

            //   await rename(temp_file_path, fs_dest_path)
            //   await deleteTemp({ tempId })

            //   return [true, { meta }]
            // },
          },
          access: {
            async deletePath({ path, type }) {
              const fs_path = fsStoragePathOf({ path })
              const file_stats = await stat(fs_path).catch(() => null)
              if (!file_stats) {
                return [false, { reason: 'notFound' }]
              }
              if (type === 'dir' && !file_stats.isDirectory()) {
                return [false, { reason: 'unexpectedType' }]
              }
              if (type === 'file' && !file_stats.isFile()) {
                return [false, { reason: 'unexpectedType' }]
              }
              return [true, _void]
            },
          },
        },
      },
    }
    return moodle_secondary_adapter
    // async function _delete_and_clean_upper_empty_dirs({ fs_path }: { fs_path: string }) {
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
    // possibly the above _delete_and_clean_upper_empty_dirs() too ?
    function get_temp_file_paths({ tempId }: { tempId: string }) {
      const temp_file_path = join(fsDirs.temp, tempId)
      const temp_file_meta_path = `${temp_file_path}.json`
      return { temp_file_path, temp_file_meta_path }
    }

    async function deleteTemp({ tempId }: { tempId: string }) {
      const { temp_file_path } = get_temp_file_paths({ tempId })
      await rimraf(`${temp_file_path}*`, { maxRetries: 2 }).catch(() => null)
    }

    function fsStoragePathOf({ path }: { path: path }) {
      const fs_path = [fsDirs.fsStorage, ...path].join(sep)
      return fs_path
    }
  }
}
