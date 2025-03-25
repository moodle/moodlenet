import { single_line_string_schema, url_string_schema } from '@moodle/lib-types'
import type { z, ZodString } from 'zod'
import { any, literal, object, string, union } from 'zod'
import { adoptAssetFormSchema } from '../../storage'
export interface UserProfilePrimaryMsgSchemaConfigs {
  profileInfoMeta: {
    displayName: { max: number; min: number; regex: null | [regex: string, flags: string] }
    aboutMe: { max: number }
    location: { max: number }
    siteUrl: { max: number }
  }
}
export type updateProfileInfoSchema = ReturnType<typeof getUserProfilePrimarySchemas>['editProfileInfoMetaSchema']
export type updateProfileInfoForm = z.infer<updateProfileInfoSchema>

export type useProfileImageSchema = ReturnType<typeof getUserProfilePrimarySchemas>['useProfileImageSchema']
export type useProfileImageForm = z.infer<useProfileImageSchema>
// export type useProfileImageForm = adoptAssetForm & {as : 'avatar' | 'background'}

export function getUserProfilePrimarySchemas({ profileInfoMeta }: UserProfilePrimaryMsgSchemaConfigs) {
  const profileImageSchema = union([literal('avatar'), literal('background')])

  const displayName = string()
    .trim()
    .min(profileInfoMeta.displayName.min)
    .max(profileInfoMeta.displayName.max)
    .pipe(
      profileInfoMeta.displayName.regex
        ? string().regex(new RegExp(...profileInfoMeta.displayName.regex))
        : (any() as unknown as ZodString),
    )
    .pipe(single_line_string_schema)
  const aboutMe = string().trim().max(profileInfoMeta.aboutMe.max)
  const location = string().trim().max(profileInfoMeta.location.max).pipe(single_line_string_schema)
  const siteUrl = url_string_schema.nullable()

  const useProfileImageSchema = object({
    type: profileImageSchema,
    adoptAssetForm: adoptAssetFormSchema,
  })

  const editProfileInfoMetaSchema = object({
    displayName,
    aboutMe,
    location,
    siteUrl,
  })

  return {
    raw: {
      profileInfoMeta: {
        displayName,
        aboutMe,
        location,
        siteUrl,
      },
    },
    editProfileInfoMetaSchema,
    useProfileImageSchema,
  }
}
