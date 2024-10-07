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
  ReturnType<typeof getMoodleNetPrimarySchemas>['updateMoodleNetInfoSchema']
>

export function getMoodleNetPrimarySchemas({ info }: MoodleNetPrimaryMsgSchemaConfigs) {
  const title = string()
    .trim()
    .min(info.title.min)
    .max(info.title.max)
    .pipe(single_line_string_schema)
  const subtitle = string()
    .trim()
    .min(info.subtitle.min)
    .max(info.subtitle.max)
    .pipe(single_line_string_schema)

  const updateMoodleNetInfoSchema = object({
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
    updateMoodleNetInfoSchema,
  }
}
