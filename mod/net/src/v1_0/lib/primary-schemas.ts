import { object, string } from 'zod'
import { MoodleNetPrimaryMsgSchemaConfigs } from '../types'

export function getMoodleNetPrimarySchemas({ info }: MoodleNetPrimaryMsgSchemaConfigs) {
  const title = string().min(info.title.min).max(info.title.max)
  const subtitle = string().min(info.subtitle.min).max(info.subtitle.max)

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
