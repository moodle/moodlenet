import { single_line_string_schema } from '@moodle/lib-types'
import type { z } from 'zod'
import { object, string } from 'zod'
export type moodlenetPrimaryMsgSchemaConfigs = {
  siteInfo: {
    title: { max: number; min: number }
    subtitle: { max: number; min: number }
  }
}
export type siteInfoForm = z.infer<ReturnType<typeof getMoodlenetPrimarySchemas>['updateSiteInfoSchema']>

export function getMoodlenetPrimarySchemas({ siteInfo }: moodlenetPrimaryMsgSchemaConfigs) {
  const siteInfoTitle = string().trim().min(siteInfo.title.min).max(siteInfo.title.max).pipe(single_line_string_schema)
  const siteInfoSubtitle = string()
    .trim()
    .min(siteInfo.subtitle.min)
    .max(siteInfo.subtitle.max)
    .pipe(single_line_string_schema)

  // const siteInfoTitle = string().trim().min(siteInfo.title.min).max(siteInfo.title.max).pipe(single_line_string_schema)

  const updateSiteInfoSchema = object({
    title: siteInfoTitle,
    subtitle: siteInfoSubtitle,
  })

  return {
    raw: {
      info: {
        title: siteInfoTitle,
        subtitle: siteInfoSubtitle,
      },
    },
    updateSiteInfoSchema,
  }
}
