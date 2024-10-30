import { single_line_string_schema } from '@moodle/lib-types'
import type { z } from 'zod'
import { object, string } from 'zod'
export type eduPrimaryMsgSchemaConfigs = {
  eduCollection: {
    title: { max: number }
    description: { max: number }
  }
}
export type eduCollectionForm = z.infer<ReturnType<typeof getEduPrimarySchemas>['eduCollectionSchema']>

export function getEduPrimarySchemas({ eduCollection }: eduPrimaryMsgSchemaConfigs) {
  const eduCollectionTitle = string().trim().max(eduCollection.title.max).pipe(single_line_string_schema)
  const eduCollectionDescription = string().trim().max(eduCollection.description.max)

  const eduCollectionSchema = object({
    title: eduCollectionTitle,
    description: eduCollectionDescription,
  })

  return {
    raw: {
      eduCollection: {
        title: eduCollectionTitle,
        description: eduCollectionDescription,
      },
    },
    eduCollectionSchema,
  }
}
