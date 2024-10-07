import { _void, blob_meta, path } from '@moodle/lib-types'
import { storage } from '@moodle/domain'
import { mkdir, readFile, rename, stat } from 'fs/promises'
import { join, sep } from 'path'
import { rimraf } from 'rimraf'

export function makeLocalFsStorageLibProvider({
  tempDir,
  homeDir,
}: {
  tempDir: string
  homeDir: string
}): storage.StorageLibProvider {
  return ({ base_path }) => {
    const getTempFileMeta: storage.StorageLib['getTempFileMeta'] = async ({
      tmpId,
    }: {
      tmpId: string
    }) => {
      const { tmp_file_meta_path } = get_tmp_file_paths(tmpId)

      const meta: blob_meta = await readFile(tmp_file_meta_path, 'utf8')
        .then(JSON.parse)
        .catch(null)

      if (!meta) {
        const { tmp_file_dir_path } = get_tmp_file_paths(tmpId)
        await rimraf(tmp_file_dir_path, { maxRetries: 2 }).catch(() => null)
        return [false, { reason: 'notFound' }]
      }

      return [true, { meta }] //, tmp_file_full_path, tmp_file_name, tmp_file_dir }
    }

    const mvTempFile: storage.StorageLib['mvTempFile'] = async ({
      tmpId,
      dest_path,
    }: {
      tmpId: string
      dest_path: path
    }) => {
      const [found, found_tmp_meta] = await getTempFileMeta({ tmpId })

      if (!found) {
        return [false, { reason: 'notFound' }]
      }

      const fs_dest_path = path2fs(dest_path)
      await mkdir(fs_dest_path, { recursive: true })
      const { tmp_file_path } = get_tmp_file_paths(tmpId)

      await rename(tmp_file_path, fs_dest_path)
      await deleteTemp({ tmpId })

      return [true, { meta: found_tmp_meta.meta }]
    }

    const deletePath: storage.StorageLib['deletePath'] = async ({
      path,
      type,
    }: {
      path: path
      type: 'file' | 'dir'
    }) => {
      const fs_path = path2fs(path)
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
      await rimraf(fs_path, { maxRetries: 2 }).catch(() => null)
      return [true, _void]
    }
    return {
      getTempFileMeta,
      deletePath,
      mvTempFile,
    }

    function get_tmp_file_paths(tmpId: string) {
      const tmp_file_dir_path = join(tempDir, tmpId)
      const tmp_file_path = join(tmp_file_dir_path, 'tmp_file')
      const tmp_file_meta_path = join(tmp_file_dir_path, 'meta.json')
      return { tmp_file_dir_path, tmp_file_path, tmp_file_meta_path }
    }

    async function deleteTemp({ tmpId }: { tmpId: string }) {
      const { tmp_file_dir_path } = get_tmp_file_paths(tmpId)
      await rimraf(tmp_file_dir_path, { maxRetries: 2 }).catch(() => null)
    }

    function path2fs(path: path) {
      const fs_path = [homeDir, ...base_path, ...path].join(sep)
      return fs_path
    }
  }
}
