import { domainFsDirectories } from '@moodle/lib-domain-fs'

export type localStorageFsDirectories = domainFsDirectories & {
  fsStorage: string
}
