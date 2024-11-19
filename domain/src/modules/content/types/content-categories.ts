import { d_u, d_u__d, fraction, url_string, url_string_schema } from '@moodle/lib-types'
import { literal, object, string, union } from 'zod'
import { asset } from '../../storage'

export type contentCredits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}
export type external_content = { url: url_string; credits?: contentCredits }

export type contentLanguageCode = string
export type contentLanguageRecord = {
  code: contentLanguageCode
  part2b: string | null
  part2t: string | null
  part1: string | null
  scope: string
  type: string
  name: string
}

export type contentLicenseCode = string
export type contentLicenseRecord = {
  code: contentLicenseCode
  name: string
  restrictiveness: fraction
}

export type adoptAssetForm = d_u<
  {
    upload: {
      tempId: string
    }
    external: external_content
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
