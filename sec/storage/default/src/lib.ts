import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { rimraf } from 'rimraf'
import sanitizeFilename from 'sanitize-filename'
import { StorageDefaultSecEnv } from './types'
import { storage } from '@moodle/domain'

// export function newFsFileRelativePath(filename: string, date = new Date()) {
//   return [
//     String(date.getFullYear()),
//     String(date.getMonth() + 1).padStart(2, '0'),
//     String(date.getUTCDate()).padStart(2, '0'),
//     String(date.getUTCHours()).padStart(2, '0'),
//     String(date.getMinutes()).padStart(2, '0'),
//     String(date.getSeconds()).padStart(2, '0'),
//     filename,
//   ]
// }
export function getSanitizedFileName(originalFilename: string) {
  const sanitized = sanitizeFilename(originalFilename)
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/^[_-]+/, '')
    .replace(/[_-]+$/, '')
    .replace(/[_-]+/g, '_')

  const rnd = String(Math.random()).substring(2, 5)
  return `${rnd}_${sanitized}`
  // originalFilename.normalize("NFD").replace(/\p{Diacritic}/gu, "")
  // const origExt = originalFilename.split('.').pop()
  // const mDotExt = origExt ? `.${origExt}` : ''
  // String(Math.random()).substring(2, 20) + mDotExt
}

// export function getSanitizedRelativeFilepath({
//   originalFilename,
//   date,
// }: {
//   originalFilename: string
//   date?: Date
// }) {
//   const sanitizedName = getSanitizedFileName(originalFilename)
//   return newFsFileRelativePath(sanitizedName, date)
// }
export function startCleanupProcess({
  currentDomainDir,
  tempFileMaxRetentionSeconds,
}: StorageDefaultSecEnv) {
  const { temp } = storage.getFsDirectories({ currentDomainDir })
  setInterval(async () => {
    const temp_dirs_or_whatever = await readdir(temp)
    temp_dirs_or_whatever.forEach(async temp_dir_or_whatever => {
      const temp_dir_or_whatever_path = join(temp, temp_dir_or_whatever)
      const { ctime } = await stat(temp_dir_or_whatever_path).catch(() => ({ ctime: null }))
      const now = Date.now()
      const timeAgoMillis = ctime ? now - ctime.getTime() : Infinity
      const expired = timeAgoMillis > tempFileMaxRetentionSeconds * 1000
      if (!expired) {
        return
      }
      rimraf(temp_dir_or_whatever_path, { maxRetries: 2 })
    })
  }, tempFileMaxRetentionSeconds * 1000)
}
