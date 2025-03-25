/* eslint-disable @typescript-eslint/no-namespace */
import { url_string_schema } from '@moodle/lib-types'
import { literal, object, string, union } from 'zod'

export const NONE_ASSET: moo.def.content.asset.none = { type: 'none' }
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
