import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import {
  deleteTemp,
  fs_storage_path_of,
  get_temp_file_paths,
  getFsDirectories,
  prefixed_domain_file_fs_paths,
  use_temp_file_as_web_image,
} from '@moodle/lib-local-fs-storage'
import { _void } from '@moodle/lib-types'
import { uploaded_blob_meta } from '@moodle/module/storage'
import { mkdir, readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'
import { rimraf } from 'rimraf'
import { StorageDefaultSecEnv } from './types'

export function get_storage_default_secondary_factory({ homeDir }: StorageDefaultSecEnv): secondaryProvider {
  return ctx => {
    const fsDirs = getFsDirectories({ domainName: ctx.domain, homeDir })
    const fs_file_paths = prefixed_domain_file_fs_paths(fsDirs.fsStorage)
    const secondaryAdapter: secondaryAdapter = {
      userProfile: {
        write: {
          async useTempImageInProfile({ as, userProfileId, tempId }) {
            ctx.log('debug', 'useImageInProfile', { as, id: userProfileId, tempId })
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const absolutePath = fs_file_paths.userProfile[userProfileId]!.profile[as]!()
            return use_temp_file_as_web_image({
              fsDirs,
              secondaryContext: ctx,
              absolutePath,
              tempId,
              size: as === 'avatar' ? 'medium' : 'large',
            })
          },
        },
      },
      storage: {
        sync: {
          async createUserProfile({ userProfileId }) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const userProfilePath = fs_file_paths.userProfile[userProfileId]!()
            await mkdir(userProfilePath, { recursive: true })
            return [true, _void]
          },
        },
        query: {
          async tempMeta({ tempId }) {
            const { meta: temp_file_meta_path } = get_temp_file_paths({ tempId, fsDirs })

            const meta: uploaded_blob_meta = await readFile(temp_file_meta_path, 'utf8').then(JSON.parse).catch(null)

            if (!meta) {
              await deleteTemp({ tempId, fsDirs }).catch(() => null)
              return [false, { reason: 'notFound' }]
            }

            return [true, { meta }] //, temp_file_full_path, temp_file_name, temp_file_dir }
          },
        },
        write: {
          async deletePath({ path, type }) {
            const fs_path = fs_storage_path_of({ path, fsDirs })
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
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'storage' })
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
        // async useTempFile({ absolutePath, tempId }) {
        //   const { temp_file_meta_path } = get_temp_file_paths({ tempId })

        //   const meta: uploaded_blob_meta = await readFile(temp_file_meta_path, 'utf8')
        //     .then(JSON.parse)
        //     .catch(null)
        //   if (!meta) {
        //     await deleteTemp({ tempId }).catch(() => null)
        //     return [false, { reason: 'notFound' }]
        //   }

        //   const fs_dest_path = path2modFsPath({ path: absolutePath })
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
