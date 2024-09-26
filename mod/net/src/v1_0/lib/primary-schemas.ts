import { object, string } from 'zod'
import { MoodleNetPrimaryMsgSchemaConfigs } from '../types'
import { single_line_string_schema } from '@moodle/lib-types'

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
