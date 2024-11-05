import { single_line_string_schema } from '@moodle/lib-types'
import type { z } from 'zod'
import { object, string } from 'zod'
export type eduPrimaryMsgSchemaConfigs = {
  eduCollectionMeta: {
    title: { max: number }
    description: { max: number }
  }
}
export type eduCollectionMetaFormSchema = ReturnType<typeof getEduPrimarySchemas>['eduCollectionMetaSchema']
export type eduCollectionMetaForm = z.infer<eduCollectionMetaFormSchema>

export type eduCollectionApplyImageFormSchema = ReturnType<typeof getEduPrimarySchemas>['applyImageSchema']
export type eduCollectionApplyImageForm = z.infer<eduCollectionApplyImageFormSchema>

export function getEduPrimarySchemas({ eduCollectionMeta }: eduPrimaryMsgSchemaConfigs) {
  const eduCollectionTitle = string().trim().max(eduCollectionMeta.title.max).pipe(single_line_string_schema)
  const eduCollectionDescription = string().trim().max(eduCollectionMeta.description.max)

  const eduCollectionMetaSchema = object({
    title: eduCollectionTitle,
    description: eduCollectionDescription,
  })

  const applyImageSchema = object({
    tempId: string().nullish(),
  })

  return {
    raw: {
      eduCollection: {
        title: eduCollectionTitle,
        description: eduCollectionDescription,
      },
    },
    applyImageSchema,
    eduCollectionMetaSchema,
  }
}
