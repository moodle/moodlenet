import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { StorageDefaultSecEnv } from './types'

export function get_storage_default_secondary_factory({
  storageLibProvider,
}: StorageDefaultSecEnv): moodle_secondary_factory {
  return ctx => {
    const storageLib = storageLibProvider({ base_path: [ctx.invoked_by.module] })
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        storage: {
          temp: {
            async getTempMeta({ tmpId }) {
              const info = await storageLib.getTempFileMeta({ tmpId })
              return info
            },
            async useTempFile({ destPath, tmpId }) {
              const use_result = await storageLib.mvTempFile({ tmpId, dest_path: destPath })
              return use_result
            },
          },
          access: {
            async deletePath({ path, type }) {
              const del_result = await storageLib.deletePath({ path, type })
              return del_result
            },
          },
        },
      },
    }
    return moodle_secondary_adapter
  }
}
