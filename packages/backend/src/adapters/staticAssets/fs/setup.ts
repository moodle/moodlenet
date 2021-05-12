import { mkdirSync } from 'fs'
import { getDir } from './adapters/lib'
type Cfg = {
  rootDir: string
}

export const setupFs = async ({ rootDir }: Cfg) => {
  const tempDir = getDir(rootDir, 'temp')
  const assetDir = getDir(rootDir, 'assets')
  await mkdirSync(tempDir, { recursive: true })
  await mkdirSync(assetDir, { recursive: true })
}
