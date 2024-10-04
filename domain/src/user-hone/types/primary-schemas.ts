import { single_line_string_schema, url_string_schema } from '@moodle/lib-types'
import type { z, ZodString } from 'zod'
import { any, object, string } from 'zod'
export interface UserHomePrimaryMsgSchemaConfigs {
  profileInfo: {
    displayName: { max: number; min: number; regex: null | [regex: string, flags: string] }
    aboutMe: { max: number }
    location: { max: number }
    siteUrl: { max: number }
  }
}
export type updateProfileInfoForm = z.infer<
  ReturnType<typeof getUserHomePrimarySchemas>['updateProfileInfoSchema']
>

export function getUserHomePrimarySchemas({ profileInfo }: UserHomePrimaryMsgSchemaConfigs) {
  const user_home_id = string().nanoid()
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
  const aboutMe = string().trim().max(profileInfo.aboutMe.max).pipe(single_line_string_schema)
  const location = string().trim().max(profileInfo.location.max).pipe(single_line_string_schema)
  const siteUrl = url_string_schema

  const updateProfileInfoSchema = object({
    user_home_id,
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
  }
}
