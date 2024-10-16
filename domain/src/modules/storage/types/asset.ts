import { d_u, d_u__d, splitMap, url_string } from '@moodle/lib-types'
import { uploaded_blob_meta } from './temp'

export type credits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}

export type assetRecord = d_u<
  {
    uploaded: uploadedAssetRecord
    external: externalAssetRecord
  },
  'type'
>

export type asset = d_u<
  {
    uploaded: upladedAssetType
    external: externalAssetType
  },
  'type'
>

type upladedAssetType = { path: string /* url_path_string */ } & metasplit[1]
type externalAssetType = { url: url_string; credits?: credits }
type uploadedAssetRecord = { asset: d_u__d<asset, 'type', 'uploaded'>; blobMeta: metasplit[0] }
type externalAssetRecord = { asset: d_u__d<asset, 'type', 'external'> }
type metasplit = splitMap<uploaded_blob_meta, 'hash' | 'uploadedBy' | 'originalSize' | 'originalHash'>
