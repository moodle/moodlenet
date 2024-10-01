import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { join, sep } from 'path'
import { deletePath, getTempFileInfo, mvTempFile } from './lib'
import { FileSystemStorageSecEnv } from './types'

export function get_file_system_storage_factory({
  fsHomeDir,
}: FileSystemStorageSecEnv): moodle_secondary_factory {
  const modsHomeDir = join(fsHomeDir, 'mods')
  const tempDir = tmpdir()
  mkdirSync(modsHomeDir, { recursive: true })
  mkdirSync(modsHomeDir, { recursive: true })

  return ctx => {
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        storage: {
          store: {
            async getTempMeta({ tmpId }) {
              const info = await getTempFileInfo({ tempDir, tmpId })
              return info ? [true, { meta: info.blob_meta }] : [false, { reason: 'notFound' }]
            },
            async mvTempFile({ destFullPath: fullPath, tmpId }) {
              const full_path_name = fullPath.join(sep)
              const mv_result = await mvTempFile({ full_path_name, tmpId, tempDir })
              if (!mv_result) {
                return [false, { reason: 'notFound' }]
              }
              return [true, _void]
            },
            async deletePath({ path, type }) {
              const full_path_name = path.join(sep)
              deletePath({ full_path_name, type })
              return [true, _void]
            },
          },
        },
      },
    }
    return moodle_secondary_adapter
  }
}
