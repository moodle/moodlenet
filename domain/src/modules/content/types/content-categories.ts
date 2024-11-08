import { d_u, fraction, url_string, url_string_schema } from '@moodle/lib-types'
import { literal, object, string } from 'zod'
import { asset } from '../../storage'

export type contentCredits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}
export type external_content = { url: url_string; credits?: contentCredits }

export type contentLanguageCode = string
export type contentLanguageRecord = {
  id: contentLanguageCode
  part2b: string | null
  part2t: string | null
  part1: string | null
  scope: string
  type: string
  name: string
}

export type contentLicenseCode = string
export type contentLicenseRecord = {
  id: contentLicenseCode
  name: string
  restrictiveness: fraction
}

export type adoptingAsset = d_u<
  {
    upload: {
      tempId: string
    }
    external: external_content
    none: unknown
  },
  'type'
>

export type adoptAssetForm = {
  adoptingAsset: adoptingAsset
}
export type adoptAssetResponse = {
  response: d_u<
    {
      // inCharge: unknown
      done: { asset: asset }
      error: { message: string }
    },
    'status'
  >
}
export type adoptAssetService = (adoptAssetForm: adoptAssetForm) => Promise<adoptAssetResponse>

export const adoptAssetFormSchema = object({
  adoptingAsset: object({
    type: literal('upload'),
    tempId: string(),
  })
    .or(
      object({
        type: literal('external'),
        url: url_string_schema,
        credits: object({
          owner: object({ name: string().max(50), url: url_string_schema }),
          provider: object({ name: string().max(50), url: url_string_schema }).optional(),
        }).optional(),
      }),
    )
    .or(
      object({
        type: literal('none'),
      }),
    ),
})
