import { single_line_string_schema } from '@moodle/lib-types'
import type { z } from 'zod'
import { array, literal, number, object, string, union } from 'zod'
import { adoptAssetFormSchema, adoptValuedAssetFormSchema } from '../../content'
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

export type createNewResourceDraftSchema = ReturnType<typeof getEduPrimarySchemas>['createNewResourceDraftSchema']
export type createNewResourceDraftSchemaForm = z.infer<createNewResourceDraftSchema>

export function getEduPrimarySchemas({ eduCollectionMeta, eduResourceMeta }: eduPrimaryMsgSchemaConfigs) {
  const applyImageSchema = object({ resourceImageForm: adoptAssetFormSchema })

  //

  const eduCollectionTitle = string().trim().max(eduCollectionMeta.title.max).pipe(single_line_string_schema)
  const eduCollectionDescription = string().trim().max(eduCollectionMeta.description.max)

  const eduCollectionMetaSchema = object({
    title: eduCollectionTitle,
    description: eduCollectionDescription,
  })

  //

  const bloomLearningOutcomeSchema = object({
    level: union([literal('1'), literal('2'), literal('3'), literal('4'), literal('5'), literal('6')]),
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
    publicationDate: object({
      month: number().min(1).max(12),
      year: number().min(1900).max(2024),
    }).nullish(),
  })
  const createNewResourceDraftSchema = object({
    newResourceAsset: adoptValuedAssetFormSchema,
    eduResourceMeta: eduResourceMetaSchema.nullish().optional(),
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
    createNewResourceDraftSchema,
  }
}
