import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { WORKING_DIR } from './env.mjs'
import { LocalMNLock } from './types.mjs'

export const WD_LOCAL_MOODLENET_LOCK = resolve(WORKING_DIR, 'moodlenet-lock.json')
if (!existsSync(WD_LOCAL_MOODLENET_LOCK)) {
  await writeLocalMNLock({ installed: false })
}

export async function readLocalMNLock(): Promise<LocalMNLock> {
  const localMNLockStr = await readFile(WD_LOCAL_MOODLENET_LOCK, { encoding: 'utf8' })
  const localMNLock = JSON.parse(localMNLockStr)
  return localMNLock
}

export async function writeLocalMNLock(localMNLock: LocalMNLock): Promise<void> {
  const localMNLockStr = JSON.stringify(localMNLock, null, 2)
  await writeFile(WD_LOCAL_MOODLENET_LOCK, localMNLockStr, { encoding: 'utf8' })
}

export async function overrideLocalMNLock(
  overrideLocalMNLock: Partial<LocalMNLock>,
): Promise<void> {
  await writeLocalMNLock({ ...(await readLocalMNLock()), ...overrideLocalMNLock })
}
