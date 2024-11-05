import { single_line_string_schema } from '@moodle/lib-types'
import type { z } from 'zod'
import { object, string } from 'zod'
export type moodlenetPrimaryMsgSchemaConfigs = {
  siteInfo: {
    title: { max: number; min: number }
    subtitle: { max: number; min: number }
  }
}
export type moodlenetInfoForm = z.infer<ReturnType<typeof getMoodlenetPrimarySchemas>['updateMoodlenetInfoSchema']>

export function getMoodlenetPrimarySchemas({ siteInfo }: moodlenetPrimaryMsgSchemaConfigs) {
  const title = string().trim().min(siteInfo.title.min).max(siteInfo.title.max).pipe(single_line_string_schema)
  const subtitle = string().trim().min(siteInfo.subtitle.min).max(siteInfo.subtitle.max).pipe(single_line_string_schema)

  const updateMoodlenetInfoSchema = object({
    title,
    subtitle,
  })

  return {
    raw: {
      info: {
        title,
        subtitle,
      },
    },
    updateMoodlenetInfoSchema,
  }
}
