import { single_line_string_schema } from '@moodle/lib-types'
import type { z } from 'zod'
import { object, string } from 'zod'
export interface MoodlenetPrimaryMsgSchemaConfigs {
  info: {
    title: { max: number; min: number }
    subtitle: { max: number; min: number }
  }
}
export type moodlenetInfoForm = z.infer<ReturnType<typeof getMoodlenetPrimarySchemas>['updateMoodlenetInfoSchema']>

export function getMoodlenetPrimarySchemas({ info }: MoodlenetPrimaryMsgSchemaConfigs) {
  const title = string().trim().min(info.title.min).max(info.title.max).pipe(single_line_string_schema)
  const subtitle = string().trim().min(info.subtitle.min).max(info.subtitle.max).pipe(single_line_string_schema)

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
