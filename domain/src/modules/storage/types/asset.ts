import { d_u, d_u__d, date_time_string, mimetype, url_string, url_string_schema } from '@moodle/lib-types'
import { literal, object, string, union } from 'zod'

import { contentCredits } from '../../content'
import { fileHashes } from './temp'

export type externalAsset = { url: url_string; credits?: contentCredits }

export type accessibleAsset = d_u<
  {
    local: localAssetMeta
    external: externalAsset
  },
  'type'
>

export type asset = d_u<
  {
    stored: storedAssetMeta
    external: externalAsset
    none: unknown
  },
  'type'
>

export const NONE_ASSET: asset = { type: 'none' }

export type storedAssetMeta = fileAssetMeta & {
  path: string
}

export type localAssetMeta = fileAssetMeta & {
  absolutePath: string
}

type fileAssetMeta = {
  name: string
  size: number
  mimetype: mimetype
  hash: fileHashes
  uploaded: {
    date: date_time_string
    primarySessionId: string
  } | null
}

export type adoptAssetForm = d_u<
  {
    upload: {
      tempId: string
    }
    external: externalAsset
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
