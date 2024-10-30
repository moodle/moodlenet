import { single_line_string_schema } from '@moodle/lib-types'
import type { z } from 'zod'
import { object, string } from 'zod'
export type eduPrimaryMsgSchemaConfigs = {
  eduCollectionMeta: {
    title: { max: number }
    description: { max: number }
  }
}
export type eduCollectionMetaForm = z.infer<ReturnType<typeof getEduPrimarySchemas>['eduCollectionMetaSchema']>

export function getEduPrimarySchemas({ eduCollectionMeta }: eduPrimaryMsgSchemaConfigs) {
  const eduCollectionTitle = string().trim().max(eduCollectionMeta.title.max).pipe(single_line_string_schema)
  const eduCollectionDescription = string().trim().max(eduCollectionMeta.description.max)

  const eduCollectionMetaSchema = object({
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
    eduCollectionMetaSchema,
  }
}
