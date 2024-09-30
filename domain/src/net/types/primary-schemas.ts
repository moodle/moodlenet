import { single_line_string_schema } from '@moodle/lib-types'
import type { z } from 'zod'
import { object, string } from 'zod'
export interface MoodleNetPrimaryMsgSchemaConfigs {
  info: {
    title: { max: number; min: number }
    subtitle: { max: number; min: number }
  }
}
export type moodlenetInfoForm = z.infer<
  ReturnType<typeof getMoodleNetPrimarySchemas>['moodleNetInfoSchema']
>

export function getMoodleNetPrimarySchemas({ info }: MoodleNetPrimaryMsgSchemaConfigs) {
  const title = single_line_string_schema.and(
    string().trim().min(info.title.min).max(info.title.max),
  )
  const subtitle = single_line_string_schema.and(
    string().trim().min(info.subtitle.min).max(info.subtitle.max),
  )

  const moodleNetInfoSchema = object({
    title,
    subtitle,
  }).partial()

  return {
    raw: {
      info: {
        title,
        subtitle,
      },
    },
    moodleNetInfoSchema,
  }
}
