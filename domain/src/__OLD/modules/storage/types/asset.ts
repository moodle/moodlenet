import { d_u, d_u__d, url_string, url_string_schema } from '@moodle/lib-types'
import { literal, object, string, union } from 'zod'

import { contentCredits } from '../../content'

export type externalAsset = { url: url_string; credits?: contentCredits }

export type maybeAsset = asset | noAsset
type noAsset = d_u<{ none: unknown }, 'type'>
export type asset = d_u<
  {
    stored: moo.def.content.fileMeta
    external: externalAsset
  },
  'type'
>

export const NONE_ASSET: noAsset = { type: 'none' }

export type adoptAssetForm = d_u<
  {
    tempFile: {
      tempId: string
    }
    external: externalAsset
    none: unknown
  },
  'type'
>

export type adoptAssetResult<assetType extends maybeAsset['type'] = maybeAsset['type']> = d_u<
  {
    assetSubmitted: unknown
    done: { asset: d_u__d<maybeAsset, 'type', assetType> }
    error: { message?: string }
  },
  'status'
>

export type adoptAssetService<accepts extends adoptAssetForm['type'] = adoptAssetForm['type']> = (
  adoptAssetForm: d_u__d<adoptAssetForm, 'type', accepts>,
) => Promise<adoptAssetResult>

export const adoptTempFileFormSchema = object({
  type: literal('tempFile'),
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
export const adoptValuedAssetFormSchema = union([adoptTempFileFormSchema, adoptExternalAssetFormSchema])
export const adoptNoneAssetFormSchema = object({
  type: literal('none'),
})
export const adoptAssetFormSchema = union([adoptValuedAssetFormSchema, adoptNoneAssetFormSchema])
