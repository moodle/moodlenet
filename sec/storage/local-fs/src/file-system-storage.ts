import { NO_JOB_HERE } from '@moodle/domain/lib'
import { storageDefaultSecEnv } from './types'

export function fs_default_storage_factory({ localStorageFsDirectories: _ }: storageDefaultSecEnv): moo.def.model.impl {
  const modelImpl: moo.def.model.impl = {
    userHome: NO_JOB_HERE,
  }
  return modelImpl
}
