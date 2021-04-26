import { mkdirSync } from 'fs'
import { resolve } from 'path'
import { StaticAssetsIO } from '../types'
import { createTemp } from './io/createTemp'
import { delAsset } from './io/delAsset'
import { delOldTemps, delTemp } from './io/delTemp'
import { makeGetAsset } from './io/getAsset'
import { makePersistTemp } from './io/persistTemp'
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
    delAsset: delAsset({ assetDir }),
    delOldTemps: delOldTemps({ tempDir }),
    getAsset: makeGetAsset({ assetDir }),
    persistTemp: makePersistTemp({ tempDir, assetDir }),
  }
}
