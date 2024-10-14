import { prefixed_domain_file_paths } from '@moodle/core-storage/lib'
import { secondaryAdapter, secondaryBootstrap, storage } from '@moodle/domain'
import { _void, ok_ko, path } from '@moodle/lib-types'
import { mkdir, readdir, readFile, rename, stat, writeFile } from 'fs/promises'
import { join, sep } from 'path'
import { rimraf } from 'rimraf'
import sharp from 'sharp'
import { StorageDefaultSecEnv } from './types'
export function get_storage_default_secondary_factory({
  homeDir,
}: StorageDefaultSecEnv): secondaryBootstrap {
  // const domainDir = path.join(env_home, 'fs-storage')
  // const fsDirs.temp = path.join(domainDir, '.temp')

  //FIXME: set in startbackground processss
  // NOTE DO REALLY BACKGROUND PROCESS BE IN CORE ? SHOULDN'T IT BE IN SECONDARIES ?

  return bootstrapCtx => {
    const fsDirs = storage.getFsDirectories({ domainName: bootstrapCtx.domain, homeDir })
    const fs_file_paths = prefixed_domain_file_paths(fsDirs.fsStorage)
    return secondaryContext => {
      const secondaryAdapter: secondaryAdapter = {
        userHome: {
          write: {
            async useImageInProfile({ as, id, tempId }) {
              const destPath = fs_file_paths.userHome[id]!.profile[as]!()
              return use_temp_file_as_web_image({
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
              const userHomePath = fs_file_paths.userHome[userHomeId]!()
              await mkdir(userHomePath, { recursive: true })
              return [true, _void]
            },
          },
          query: {
            async tempMeta({ tempId }) {
              const { meta: temp_file_meta_path } = get_temp_file_paths({ tempId })

              const meta: storage.temp_blob_meta = await readFile(temp_file_meta_path, 'utf8')
                .then(JSON.parse)
                .catch(null)

              if (!meta) {
                await deleteTemp({ tempId }).catch(() => null)
                return [false, { reason: 'notFound' }]
              }

              return [true, { meta }] //, temp_file_full_path, temp_file_name, temp_file_dir }
            },
          },
          write: {
            async deletePath({ path, type }) {
              const fs_path = fs_storage_path_of({ path })
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
      }
      return secondaryAdapter
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

      type temp_file_paths = {
        file: string
        meta: string
      }

      function get_temp_file_paths({ tempId }: { tempId: string }): temp_file_paths {
        const file = join(fsDirs.temp, tempId)
        const meta = `${file}.json`
        return { file, meta }
      }

      async function deleteTemp({ tempId }: { tempId: string }) {
        const { file: temp_file_path } = get_temp_file_paths({ tempId })
        await rimraf(`${temp_file_path}*`, { maxRetries: 2 }).catch(() => null)
      }

      function fs_storage_path_of({ path }: { path: path }) {
        const fs_path = [fsDirs.fsStorage, ...path].join(sep)
        return fs_path
      }

      async function ensure_temp_file({ tempId }: { tempId: string }) {
        const temp_paths = get_temp_file_paths({ tempId })

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
      async function use_temp_file_as_web_image({
        tempId,
        destPath,
        size,
      }: {
        tempId: string
        destPath: string
        size: storage.webImageSize
      }): Promise<storage.useTempFileAsWebImageResult> {
        const [resizeDone, resizeResult] = await resizeTempImage({ size, tempId })
        // console.log({ resizeDone, resizeResult })
        if (!resizeDone) {
          return [false, resizeResult]
        }
        const use_temp_file_result = await use_temp_file({
          tempId: resizeResult.resizedTempId,
          destPath,
        })
        return use_temp_file_result
      }

      async function use_temp_file({
        tempId,
        destPath,
      }: {
        tempId: string
        destPath: string
      }): Promise<storage.useTempFileResult> {
        const temp_file = await ensure_temp_file({ tempId })
        if (!temp_file) {
          return [false, { reason: 'tempNotFound' }]
        }
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

      async function resizeTempImage({
        size,
        tempId,
      }: {
        tempId: string
        size: storage.webImageSize
      }): Promise<
        ok_ko<
          { resizedTempId: string; resizedTempFilePaths: temp_file_paths },
          { tempNotFound: unknown; invalidImage: unknown }
        >
      > {
        const original_temp_file = await ensure_temp_file({ tempId })
        if (!original_temp_file) {
          return [false, { reason: 'tempNotFound' }]
        }
        const {
          configs: { webImageResizes },
        } = await secondaryContext.mod.env.query.modConfigs({ mod: 'storage' })
        const resizeTo = webImageResizes[size]
        original_temp_file.temp_paths.file

        const resizedTempId = `${tempId}_${size}`
        const resizedTempFilePaths = get_temp_file_paths({ tempId: resizedTempId })
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
    }
  }
}
