import { single_line_string_schema } from '@moodle/lib-types'
import type { z } from 'zod'
import { array, number, object, string } from 'zod'
import { adoptAssetFormSchema } from '../../content'
export type eduPrimaryMsgSchemaConfigs = {
  eduCollectionMeta: {
    title: { max: number }
    description: { max: number }
  }
  eduResourceMeta: {
    title: { max: number }
    description: { max: number }
  }
}
export type eduCollectionMetaFormSchema = ReturnType<typeof getEduPrimarySchemas>['eduCollectionMetaSchema']
export type eduCollectionMetaForm = z.infer<eduCollectionMetaFormSchema>

export type eduCollectionApplyImageFormSchema = ReturnType<typeof getEduPrimarySchemas>['applyImageSchema']
export type eduCollectionApplyImageForm = z.infer<eduCollectionApplyImageFormSchema>

//

export type eduResourceMetaFormSchema = ReturnType<typeof getEduPrimarySchemas>['eduResourceMetaSchema']
export type eduResourceMetaForm = z.infer<eduResourceMetaFormSchema>

export type eduResourceApplyImageFormSchema = ReturnType<typeof getEduPrimarySchemas>['applyImageSchema']
export type eduResourceApplyImageForm = z.infer<eduResourceApplyImageFormSchema>

export function getEduPrimarySchemas({ eduCollectionMeta, eduResourceMeta }: eduPrimaryMsgSchemaConfigs) {
  const applyImageSchema = object({ adoptAssetForm: adoptAssetFormSchema })

  //

  const eduCollectionTitle = string().trim().max(eduCollectionMeta.title.max).pipe(single_line_string_schema)
  const eduCollectionDescription = string().trim().max(eduCollectionMeta.description.max)

  const eduCollectionMetaSchema = object({
    title: eduCollectionTitle,
    description: eduCollectionDescription,
  })

  //

  const bloomLearningOutcomeSchema = object({
    level: string(),
    verb: string(),
    learningOutcome: string(),
  })
  const eduResourceTitle = string().trim().max(eduResourceMeta.title.max).pipe(single_line_string_schema)
  const eduResourceDescription = string().trim().max(eduResourceMeta.description.max)

  const eduResourceMetaSchema = object({
    title: eduResourceTitle,
    description: eduResourceDescription,
    iscedField: string().nullish(),
    iscedLevel: string().nullish(),
    type: string().nullish(),
    language: string().nullish(),
    license: string().nullish(),
    bloomLearningOutcomes: array(bloomLearningOutcomeSchema),
    publicationDate: object({ month: number().int().min(1).max(12), year: number().int().min(1900).max(2024) }).nullish(),
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
    eduResourceMetaSchema,
  }
}

