import { single_line_string_schema } from '@moodle/lib-types'
import type { z } from 'zod'
import { object, string } from 'zod'
import { moodlenetInfoSchemaConfigs } from '../types'
export type siteInfoForm = z.infer<ReturnType<typeof getMoodlenetInfoSchemas>['editInfoSchema']>

export function getMoodlenetInfoSchemas(info: moodlenetInfoSchemaConfigs) {
  const infoTitle = string().trim().min(info.title.min).max(info.title.max).pipe(single_line_string_schema)
  const infoSubtitle = string().trim().min(info.subtitle.min).max(info.subtitle.max).pipe(single_line_string_schema)

  // const siteInfoTitle = string().trim().min(siteInfo.title.min).max(siteInfo.title.max).pipe(single_line_string_schema)

  const editInfoSchema = object({
    title: infoTitle,
    subtitle: infoSubtitle,
  })

  return {
    raw: {
      info: {
        title: infoTitle,
        subtitle: infoSubtitle,
      },
    },
    editInfoSchema,
  }
}
