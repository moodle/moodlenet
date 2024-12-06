import { domainFsDirectories } from '@moodle/lib-domain-fs'

export interface StorageDefaultSecEnv {
  domainFsDirectories: domainFsDirectories
  localFsStorageDirectory: string
}
