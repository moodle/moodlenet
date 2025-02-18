import { NO_JOB_HERE } from '@moodle/domain/lib'
import { storageDefaultSecEnv } from './types'

export function fs_default_storage_factory({ localStorageFsDirectories: _ }: storageDefaultSecEnv): moo.model.impl {
  const modelImpl: moo.model.impl = {
    userAccount: NO_JOB_HERE,
  }
  return modelImpl
}
