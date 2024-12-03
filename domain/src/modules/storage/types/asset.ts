import { d_u, d_u__d, date_time_string, mimetype, url_string, url_string_schema } from '@moodle/lib-types'
import { literal, object, string, union } from 'zod'

import { contentCredits } from '../../content'
import { fileHashes } from './temp'

export type external_asset = { url: url_string; credits?: contentCredits }

export type asset = d_u<
  {
    local: local_asset_meta
    external: external_asset
    none: unknown
  },
  'type'
>
export const NONE_ASSET: asset = { type: 'none' }

export type local_asset_meta = {
  path: string
  name: string
  size: number
  mimetype: mimetype
  hash: fileHashes
  uploaded: {
    date: date_time_string
    primarySessionId: string
  }
}

export type adoptAssetForm = d_u<
  {
    upload: {
      tempId: string
    }
    external: external_asset
    none: unknown
  },
  'type'
>

export type adoptAssetResponse<assetType extends asset['type'] = asset['type']> = d_u<
  {
    assetSubmitted: unknown
    done: { asset: d_u__d<asset, 'type', assetType> }
    error: { message?: string }
  },
  'status'
>

export type adoptAssetService<accepts extends adoptAssetForm['type'] = adoptAssetForm['type']> = (
  adoptAssetForm: d_u__d<adoptAssetForm, 'type', accepts>,
) => Promise<adoptAssetResponse>

export const adoptUploadedAssetFormSchema = object({
  type: literal('upload'),
  tempId: string(),
})
export const adoptExternalAssetFormSchema = object({
  type: literal('external'),
  url: url_string_schema,
  credits: object({
    owner: object({ name: string().max(50), url: url_string_schema }),
    provider: object({ name: string().max(50), url: url_string_schema }).optional(),
  }).optional(),
})
export const adoptValuedAssetFormSchema = union([adoptUploadedAssetFormSchema, adoptExternalAssetFormSchema])
export const adoptNoneAssetFormSchema = object({
  type: literal('none'),
})
export const adoptAssetFormSchema = union([adoptValuedAssetFormSchema, adoptNoneAssetFormSchema])
