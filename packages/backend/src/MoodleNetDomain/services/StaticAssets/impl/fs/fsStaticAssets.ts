import { mkdirSync } from 'fs'
import { resolve } from 'path'
import { StaticAssetsIO } from '../types'
import { createTemp } from './io/createTemp'
import { delOldTemps } from './io/delOldTemps'
import { delTemp } from './io/delTemp'
import { getAsset } from './io/getAsset'
import { persistTemp } from './io/persistTemp'
type Cfg = {
  rootFolder: string
}

export const createFSStaticAssets = ({ rootFolder }: Cfg): StaticAssetsIO => {
  const tempDir = resolve(rootFolder, '.temp')
  mkdirSync(tempDir, { recursive: true })
  const assetsDir = resolve(rootFolder, 'assets')
  mkdirSync(assetsDir, { recursive: true })

  return {
    createTemp: createTemp({ tempDir }),
    delTemp: delTemp({ tempDir }),
    delOldTemps: delOldTemps({ tempDir }),
    getAsset: getAsset({ assetsDir }),
    persistTemp: persistTemp({ tempDir }),
  }
}
