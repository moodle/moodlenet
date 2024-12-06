import { domainFsDirectories } from '@moodle/module/storage'

export type localFsDirectories = domainFsDirectories & {
  fsStorage: string
}
