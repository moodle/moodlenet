import { uploaded_blob_meta } from 'domain/src/modules/storage'
import { url_string } from './data'
import { d_u } from './map'

export type credits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}

type uploadedAssetRecord = {
  uploadMeta: uploaded_blob_meta
  // storageId: string
}

type externalAssetRecord = {
  url: url_string
  credits?: credits
}

export type assetRecord = d_u<
  { uploaded: uploadedAssetRecord; external: externalAssetRecord },
  'type'
>

export type asset = {
  type: 'uploaded' | 'external'
  url: url_string
  credits?: credits
}
