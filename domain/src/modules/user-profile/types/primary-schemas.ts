import { single_line_string_schema, url_string_schema } from '@moodle/lib-types'
import type { z, ZodString } from 'zod'
import { any, literal, object, string, union } from 'zod'
export interface UserProfilePrimaryMsgSchemaConfigs {
  displayName: { max: number; min: number; regex: null | [regex: string, flags: string] }
  aboutMe: { max: number }
  location: { max: number }
  siteUrl: { max: number }
}
export type updateProfileInfoForm = z.infer<ReturnType<typeof getUserProfilePrimarySchemas>['updateProfileInfoSchema']>
export type useProfileImageForm = z.infer<ReturnType<typeof getUserProfilePrimarySchemas>['useProfileImageSchema']>

export function getUserProfilePrimarySchemas(profileInfo: UserProfilePrimaryMsgSchemaConfigs) {
  const profileImageSchema = union([literal('avatar'), literal('background')])

  const userProfileId = string().min(6)
  const displayName = string()
    .trim()
    .min(profileInfo.displayName.min)
    .max(profileInfo.displayName.max)
    .pipe(
      profileInfo.displayName.regex
        ? string().regex(new RegExp(...profileInfo.displayName.regex))
        : (any() as unknown as ZodString),
    )
    .pipe(single_line_string_schema)
  const aboutMe = string().trim().max(profileInfo.aboutMe.max).optional()
  const location = string().trim().max(profileInfo.location.max).optional().pipe(single_line_string_schema)
  const siteUrl = url_string_schema.nullish()

  const useProfileImageSchema = object({
    as: profileImageSchema,
    tempId: string(),
    userProfileId: string(),
  })

  const updateProfileInfoSchema = object({
    userProfileId,
    displayName,
    aboutMe,
    location,
    siteUrl,
  })

  return {
    raw: {
      profileInfo: {
        displayName,
        aboutMe,
        location,
        siteUrl,
      },
    },
    updateProfileInfoSchema,
    useProfileImageSchema,
  }
}
