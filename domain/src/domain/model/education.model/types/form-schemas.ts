import { i_nat_schema, single_line_string_schema, zod_m_nullable } from '@moodle/lib-types'
import type { z } from 'zod'
import { array, enum as enum_z, number, object, string } from 'zod'
import { adoptAssetFormSchema, adoptValuedAssetFormSchema } from '../../../../lib'
import { enabledContentCategories } from '../../content.model'
import { eduSchemaConfigs, enabledEduCategories } from './configs'

export type eduCollectionMetaFormSchema = ReturnType<typeof getEduFormSchemas>['eduCollectionMetaSchema']
export type eduCollectionMetaForm = z.infer<eduCollectionMetaFormSchema>

export type eduCollectionApplyImageFormSchema = ReturnType<typeof getEduFormSchemas>['applyImageSchema']
export type eduCollectionApplyImageForm = z.infer<eduCollectionApplyImageFormSchema>

export type eduResourceMetaFormSchema = ReturnType<typeof getEduFormSchemas>['eduResourceMetaSchema']
export type eduResourceMetaForm = z.infer<eduResourceMetaFormSchema>

export type eduResourceApplyImageFormSchema = ReturnType<typeof getEduFormSchemas>['applyImageSchema']
export type eduResourceApplyImageForm = z.infer<eduResourceApplyImageFormSchema>

export type createNewEduResourceDraftSchema = ReturnType<typeof getEduFormSchemas>['createNewEduResourceDraftSchema']
export type createNewEduResourceDraftSchemaForm = z.infer<createNewEduResourceDraftSchema>

export function getEduFormSchemas({
  eduSchemaConfigs,
  enabledEduCategories,
  enabledContentCategories,
}: {
  eduSchemaConfigs: eduSchemaConfigs
  enabledEduCategories: enabledEduCategories
  enabledContentCategories: enabledContentCategories
}) {
  const applyImageSchema = object({ resourceImageForm: adoptAssetFormSchema })

  const eduCollectionTitle = string().trim().max(eduSchemaConfigs.collection.title.max).min(eduSchemaConfigs.collection.title.min).pipe(single_line_string_schema)
  const eduCollectionDescription = string().trim().max(eduSchemaConfigs.collection.description.max).min(eduSchemaConfigs.collection.description.min)

  const eduCollectionRawMetaSchema = {
    title: eduCollectionTitle,
    description: eduCollectionDescription,
  }
  const eduCollectionMetaSchema = object(eduCollectionRawMetaSchema)

  const eduResourceBloomLearningOutcome = object({
    level: i_nat_schema,
    verb: string(),
    sentence: string().trim().min(eduSchemaConfigs.resource.bloomLearningOutcomes.sentence.min).max(eduSchemaConfigs.resource.bloomLearningOutcomes.sentence.max),
  }).refine(
    ({ level, verb }) => {
      const foundLevelRecord = enabledEduCategories.bloomCognitives.find(record => record.level === level)
      const foundLevelVerb = foundLevelRecord?.verbs.find(levelVerb => levelVerb === verb)
      return !!foundLevelVerb
    },
    {
      message: 'Invalid learning outcome',
    },
  )

  const eduResourceTitle = string().trim().max(eduSchemaConfigs.resource.title.max).min(eduSchemaConfigs.resource.title.min).pipe(single_line_string_schema)
  const eduResourceDescription = string().trim().max(eduSchemaConfigs.resource.description.max).min(eduSchemaConfigs.resource.description.min)
  const eduResourceIscedField = zod_m_nullable(
    enum_z(enabledEduCategories.iscedFields.map(({ code }) => code) as [string, ...string[]]),
    !eduSchemaConfigs.resource.iscedField.required,
  )
  const eduResourceIscedLevel = zod_m_nullable(
    enum_z(enabledEduCategories.iscedLevels.map(({ code }) => code) as [string, ...string[]]),
    !eduSchemaConfigs.resource.iscedLevel.required,
  )
  const eduResourceType = zod_m_nullable(enum_z(enabledEduCategories.resourceTypes.map(({ code }) => code) as [string, ...string[]]), !eduSchemaConfigs.resource.type.required)
  const eduResourceLanguage = zod_m_nullable(
    enum_z(enabledContentCategories.languages.map(({ code }) => code) as [string, ...string[]]),
    !eduSchemaConfigs.resource.language.required,
  )
  const eduResourceLicense = zod_m_nullable(enum_z(enabledContentCategories.licenses.map(({ code }) => code) as [string, ...string[]]), !eduSchemaConfigs.resource.license.required)
  const eduResourcePublicationDate = zod_m_nullable(
    object({
      month: number().int().min(1).max(12).nullable(),
      year: number().int().min(eduSchemaConfigs.resource.publicationDate.sinceYear),
    }),
    !eduSchemaConfigs.resource.publicationDate.required,
  )

  const eduResourceBloomLearningOutcomes = array(eduResourceBloomLearningOutcome)
    .min(eduSchemaConfigs.resource.bloomLearningOutcomes.amount.min)
    .max(eduSchemaConfigs.resource.bloomLearningOutcomes.amount.max)

  const eduResourceMetaRawSchemas = {
    title: eduResourceTitle,
    description: eduResourceDescription,
    bloomLearningOutcomes: eduResourceBloomLearningOutcomes,
    iscedField: eduResourceIscedField,
    iscedLevel: eduResourceIscedLevel,
    type: eduResourceType,
    language: eduResourceLanguage,
    license: eduResourceLicense,
    publicationDate: eduResourcePublicationDate,
  }
  const eduResourceMetaSchema = object(eduResourceMetaRawSchemas)

  const createNewEduResourceDraftSchema = object({
    newResourceAsset: adoptValuedAssetFormSchema,
  })

  return {
    raw: {
      eduCollection: eduCollectionRawMetaSchema,
      eduResourceMeta: eduResourceMetaRawSchemas,
    },
    applyImageSchema,
    eduCollectionMetaSchema,
    eduResourceMetaSchema,
    createNewEduResourceDraftSchema,
  }
}
