import { secondaryAdapter, secondaryBootstrap, storage } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { mkdir, readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'
import { rimraf } from 'rimraf'
import * as lib from './lib'
import { StorageDefaultSecEnv } from './types'
import { prefixed_domain_file_fs_paths } from '@moodle/core-storage/lib'

export function get_storage_default_secondary_factory({
  homeDir,
}: StorageDefaultSecEnv): secondaryBootstrap {
  return ({ log, domain }) => {
    const fsDirs = storage.getFsDirectories({ domainName: domain, homeDir })
    const fs_file_paths = prefixed_domain_file_fs_paths(fsDirs.fsStorage)
    return secondaryContext => {
      const secondaryAdapter: secondaryAdapter = {
        userHome: {
          write: {
            async useImageInProfile({ as, id, tempId }) {
              log('debug', 'useImageInProfile', { as, id, tempId })
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const destPath = fs_file_paths.userHome[id]!.profile[as]!()
              return lib.use_temp_file_as_web_image({
                fsDirs,
                secondaryContext,
                destPath,
                tempId,
                size: as === 'avatar' ? 'medium' : 'large',
              })
            },
          },
        },
        storage: {
          sync: {
            async createUserHome({ userHomeId }) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const userHomePath = fs_file_paths.userHome[userHomeId]!()
              await mkdir(userHomePath, { recursive: true })
              return [true, _void]
            },
          },
          query: {
            async tempMeta({ tempId }) {
              const { meta: temp_file_meta_path } = lib.get_temp_file_paths({ tempId, fsDirs })

              const meta: storage.uploaded_blob_meta = await readFile(temp_file_meta_path, 'utf8')
                .then(JSON.parse)
                .catch(null)

              if (!meta) {
                await lib.deleteTemp({ tempId, fsDirs }).catch(() => null)
                return [false, { reason: 'notFound' }]
              }

              return [true, { meta }] //, temp_file_full_path, temp_file_name, temp_file_dir }
            },
          },
          write: {
            async deletePath({ path, type }) {
              const fs_path = lib.fs_storage_path_of({ path, fsDirs })
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
            async deleteStaleTemp() {
              const {
                configs: { tempFileMaxRetentionSeconds },
              } = await secondaryContext.mod.env.query.modConfigs({ mod: 'storage' })
              const tempFileMaxRetentionMilliseconds = tempFileMaxRetentionSeconds * 1000
              const { temp } = fsDirs
              const temp_dirs_or_whatever = await readdir(temp)
              temp_dirs_or_whatever.forEach(async temp_dir_or_whatever => {
                const temp_dir_or_whatever_path = join(temp, temp_dir_or_whatever)
                const { ctime } = await stat(temp_dir_or_whatever_path).catch(() => ({
                  ctime: null,
                }))
                const now = Date.now()
                const timeAgoMillis = ctime ? now - ctime.getTime() : Infinity
                const expired = timeAgoMillis > tempFileMaxRetentionMilliseconds
                if (!expired) {
                  return
                }
                rimraf(temp_dir_or_whatever_path, { maxRetries: 2 })
              })
              //setTimeout(cleanupTemp, tempFileMaxRetentionMilliseconds)
            },
          },
          // async useTempFile({ destPath, tempId }) {
          //   const { temp_file_meta_path } = get_temp_file_paths({ tempId })

          //   const meta: uploaded_blob_meta = await readFile(temp_file_meta_path, 'utf8')
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
      }
      return secondaryAdapter
    }
  }
}
