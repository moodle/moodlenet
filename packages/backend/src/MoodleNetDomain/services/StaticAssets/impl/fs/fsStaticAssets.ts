import { mkdirSync } from 'fs'
import { resolve } from 'path'
import { StaticAssetsIO } from '../types'
import { createTemp } from './io/createTemp'
import { delOldTemps } from './io/delOldTemps'
import { delTemp } from './io/delTemp'
import { fn_makeGetAsset } from './io/getAsset'
import { fn_makePersistTemp } from './io/persistTemp'
type Cfg = {
  rootFolder: string
}

export const createFSStaticAssets = ({ rootFolder }: Cfg): StaticAssetsIO => {
  const tempDir = resolve(rootFolder, '.temp')
  mkdirSync(tempDir, { recursive: true })
  const assetDir = resolve(rootFolder, 'assets')
  mkdirSync(assetDir, { recursive: true })

  return {
    createTemp: createTemp({ tempDir }),
    delTemp: delTemp({ tempDir }),
    delOldTemps: delOldTemps({ tempDir }),
    getAsset: fn_makeGetAsset({ assetDir }),
    persistTemp: fn_makePersistTemp({ tempDir, assetDir }),
  }
}
