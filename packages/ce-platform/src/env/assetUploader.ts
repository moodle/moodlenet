import { UploadMaxSizes } from '../../../backend/node_modules/@moodlenet/common/dist/staticAsset/lib'

const ASSET_UPLOADER_MAX_SIZE = parseInt(process.env.ASSET_UPLOADER_MAX_SIZE ?? '--should-be-set--')

if (!ASSET_UPLOADER_MAX_SIZE) {
  console.error('ASSET_UPLOADER Env:')
  console.error({ ASSET_UPLOADER_MAX_SIZE })
  throw new Error(`some env missing or invalid`)
}

const assetUploaderEnv: { uploadMaxSizes: UploadMaxSizes } = {
  uploadMaxSizes: {
    resourceMaxSize: ASSET_UPLOADER_MAX_SIZE,
    imageMaxSize: ASSET_UPLOADER_MAX_SIZE,
    iconMaxSize: ASSET_UPLOADER_MAX_SIZE,
  },
}

export type AssetUploaderEnv = typeof assetUploaderEnv

export default assetUploaderEnv
