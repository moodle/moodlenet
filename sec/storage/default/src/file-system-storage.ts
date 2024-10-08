import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { _void, blob_meta, path } from '@moodle/lib-types'
import { mkdir, readdir, readFile, rename, stat } from 'fs/promises'
import { dirname, join, normalize, sep } from 'path'
import { rimraf } from 'rimraf'
import { startCleanupProcess } from './lib'
import { StorageDefaultSecEnv } from './types'
import { mkdirSync } from 'fs'

export function get_storage_default_secondary_factory({
  domainDir,
  tmpDir,
  tmpFileMaxRetentionSeconds,
}: StorageDefaultSecEnv): moodle_secondary_factory {
  mkdirSync(domainDir, { recursive: true })
  mkdirSync(tmpDir, { recursive: true })

  startCleanupProcess({ tmpFileMaxRetentionSeconds, domainDir, tmpDir })

  return ctx => {
    const moduleBaseDir = join(domainDir, ctx.invoked_by.module)
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        storage: {
          // 'stream-in': {
          //   async temp({ readable, meta }) {
          //     const tmpId = await generateUlid()
          //     const { tmp_file_dir_path, tmp_file_path, tmp_file_meta_path } = get_tmp_file_paths({
          //       tmpId,
          //     })
          //     return mkdir(tmp_file_dir_path, { recursive: true })
          //       .then(async () => {
          //         return new Promise<void>((resolve, reject) => {
          //           const writeStream = createWriteStream(tmp_file_path)
          //           readable.pipe(writeStream)
          //           writeStream.on('finish', resolve)
          //           writeStream.on('error', reject)
          //         })
          //       })
          //       .then(async () => {
          //         await writeFile(JSON.stringify(meta, null, 2), tmp_file_meta_path, 'utf8')
          //         return [true, { meta, tmpId }] as const
          //       })
          //       .catch(e => {
          //         deleteTemp({ tmpId }).catch(() => null)

          //         return [false, { reason: 'error', message: String(e) }] as const
          //       })
          //   },
          // },
          temp: {
            async getTempMeta({ tmpId }) {
              const { tmp_file_meta_path } = get_tmp_file_paths({ tmpId })

              const meta: blob_meta = await readFile(tmp_file_meta_path, 'utf8')
                .then(JSON.parse)
                .catch(null)

              if (!meta) {
                await deleteTemp({ tmpId }).catch(() => null)
                return [false, { reason: 'notFound' }]
              }

              return [true, { meta }] //, tmp_file_full_path, tmp_file_name, tmp_file_dir }
            },
            async useTempFile({ destPath, tmpId }) {
              const { tmp_file_meta_path } = get_tmp_file_paths({ tmpId })

              const meta: blob_meta = await readFile(tmp_file_meta_path, 'utf8')
                .then(JSON.parse)
                .catch(null)
              if (!meta) {
                await deleteTemp({ tmpId }).catch(() => null)
                return [false, { reason: 'notFound' }]
              }

              const fs_dest_path = path2modFsPath({ path: destPath })
              await mkdir(fs_dest_path, { recursive: true })
              const { tmp_file_path } = get_tmp_file_paths({ tmpId })

              await rename(tmp_file_path, fs_dest_path)
              await deleteTemp({ tmpId })

              return [true, { meta }]
            },
          },
          access: {
            async deletePath({ path, type }) {
              const fs_path = path2modFsPath({ path })
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
              await _delete_and_clean_upper_empty_dirs({ fs_path })
              return [true, _void]
            },
          },
        },
      },
    }
    return moodle_secondary_adapter
    async function _delete_and_clean_upper_empty_dirs({ fs_path }: { fs_path: string }) {
      //TODO: ensure this check is enough to avoid climbing up too much !
      if (normalize(moduleBaseDir).startsWith(normalize(fs_path))) {
        return
      }
      await rimraf(fs_path, { maxRetries: 2 }).catch(() => null)
      const parent_dir = dirname(fs_path)
      const parent_dir_files = await readdir(parent_dir).catch(() => [
        `placeholder in case of (unlikely) readdir error
          to prevent deleting this dir, as it's not ensured to be empy`,
      ])
      if (parent_dir_files.length > 0) {
        return
      }
      return _delete_and_clean_upper_empty_dirs({ fs_path: parent_dir })
    }
    function get_tmp_file_paths({ tmpId }: { tmpId: string }) {
      const tmp_file_dir_path = join(tmpDir, tmpId)
      const tmp_file_path = join(tmp_file_dir_path, 'tmp_file')
      const tmp_file_meta_path = join(tmp_file_dir_path, 'meta.json')
      return { tmp_file_dir_path, tmp_file_path, tmp_file_meta_path }
    }

    async function deleteTemp({ tmpId }: { tmpId: string }) {
      const { tmp_file_dir_path } = get_tmp_file_paths({ tmpId })
      await rimraf(tmp_file_dir_path, { maxRetries: 2 }).catch(() => null)
    }

    function path2modFsPath({ path }: { path: path }) {
      const fs_path = [moduleBaseDir, ...path].join(sep)
      return fs_path
    }
  }
}
