import { unlinkSync, writeFileSync } from 'fs'
import { access } from 'fs/promises'
import { resolve } from 'path'

export function lockFileName(baseBuildFolder: string) {
  const LOCKFILE = resolve(baseBuildFolder, '.build-lock')
  return LOCKFILE
}
export function lockFile(baseBuildFolder: string, set: boolean) {
  const LOCKFILE = lockFileName(baseBuildFolder)
  // console.log({ LOCKFILE, set })
  set ? writeFileSync(LOCKFILE, '', { encoding: 'utf-8' }) : unlinkSync(LOCKFILE)
}

export async function isLockFilePresent(baseBuildFolder: string) {
  const LOCKFILE = lockFileName(baseBuildFolder)
  const isPresent = await access(LOCKFILE).then(
    () => true,
    () => false,
  )
  // console.log({ LOCKFILE, isPresent, baseBuildFolder })
  return isPresent
}
