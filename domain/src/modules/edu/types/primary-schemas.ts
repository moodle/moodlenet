import { single_line_string_schema, zod_m_nullable } from '@moodle/lib-types'
import type { z } from 'zod'
import { array, enum as enum_z, number, object, string } from 'zod'
import { adoptAssetFormSchema, adoptValuedAssetFormSchema } from '../../storage'
import { contentLanguageCode, contentLicenseCode } from '../../content'
import { eduBloomCognitiveRecord, eduIscedFieldCode, eduIscedLevelCode, eduResourceTypeCode } from './edu-categories'

export type eduPrimaryMsgSchemaConfigs = {
  eduCollectionMeta: {
    title: { max: number; min: number }
    description: { max: number; min: number }
  }
  eduResourceMeta: {
    title: { max: number; min: number }
    description: { max: number; min: number }
    bloomLearningOutcomes: {
      amount: { max: number; min: number }
      sentence: { max: number; min: number }
    }
    iscedField: { required: boolean }
    iscedLevel: { required: boolean }
    type: { required: boolean }
    language: { required: boolean }
    license: { required: boolean }
    publicationDate: { required: boolean; sinceYear: number }
  }
}

export type eduPrimaryEnabledCategoriesSchemaConfigs = {
  eduIscedFields: { enabled: { code: eduIscedFieldCode }[] }
  eduIscedLevels: { enabled: { code: eduIscedLevelCode }[] }
  eduResourceTypes: { enabled: { code: eduResourceTypeCode }[] }
  contentLanguages: { enabled: { code: contentLanguageCode }[] }
  contentLicenses: { enabled: { code: contentLicenseCode }[] }
  eduBloomCognitives: { enabled: Pick<eduBloomCognitiveRecord, 'verbs' | 'level'>[] }
}

export type eduCollectionMetaFormSchema = ReturnType<typeof getEduPrimarySchemas>['eduCollectionMetaSchema']
export type eduCollectionMetaForm = z.infer<eduCollectionMetaFormSchema>

export type eduCollectionApplyImageFormSchema = ReturnType<typeof getEduPrimarySchemas>['applyImageSchema']
export type eduCollectionApplyImageForm = z.infer<eduCollectionApplyImageFormSchema>

export type eduResourceMetaFormSchema = ReturnType<typeof getEduPrimarySchemas>['eduResourceMetaSchema']
export type eduResourceMetaForm = z.infer<eduResourceMetaFormSchema>

export type eduResourceApplyImageFormSchema = ReturnType<typeof getEduPrimarySchemas>['applyImageSchema']
export type eduResourceApplyImageForm = z.infer<eduResourceApplyImageFormSchema>

export type createNewEduResourceDraftSchema = ReturnType<typeof getEduPrimarySchemas>['createNewEduResourceDraftSchema']
export type createNewEduResourceDraftSchemaForm = z.infer<createNewEduResourceDraftSchema>

export function getEduPrimarySchemas(
  { eduCollectionMeta, eduResourceMeta }: eduPrimaryMsgSchemaConfigs,
  {
    eduIscedFields,
    eduIscedLevels,
    eduResourceTypes,
    contentLanguages,
    contentLicenses,
    eduBloomCognitives: bloomCognitives,
  }: eduPrimaryEnabledCategoriesSchemaConfigs,
) {
  const applyImageSchema = object({ resourceImageForm: adoptAssetFormSchema })

  const eduCollectionTitle = string()
    .trim()
    .max(eduCollectionMeta.title.max)
    .min(eduCollectionMeta.title.min)
    .pipe(single_line_string_schema)
  const eduCollectionDescription = string()
    .trim()
    .max(eduCollectionMeta.description.max)
    .min(eduCollectionMeta.description.min)

  const eduCollectionRawMetaSchema = {
    title: eduCollectionTitle,
    description: eduCollectionDescription,
  }
  const eduCollectionMetaSchema = object(eduCollectionRawMetaSchema)

  const eduResourceBloomLearningOutcome = object({
    level: string(),
    verb: string(),
    sentence: string()
      .trim()
      .min(eduResourceMeta.bloomLearningOutcomes.sentence.min)
      .max(eduResourceMeta.bloomLearningOutcomes.sentence.max),
  }).refine(
    ({ level, verb }) => {
      const foundLevelRecord = bloomCognitives.enabled.find(record => record.level === level)
      const foundLevelVerb = foundLevelRecord?.verbs.find(levelVerb => levelVerb === verb)
      return !!foundLevelVerb
    },
    {
      message: 'Invalid learning outcome',
    },
  )

  const eduResourceTitle = string()
    .trim()
    .max(eduResourceMeta.title.max)
    .min(eduResourceMeta.title.min)
    .pipe(single_line_string_schema)
  const eduResourceDescription = string().trim().max(eduResourceMeta.description.max).min(eduResourceMeta.description.min)
  const eduResourceIscedField = zod_m_nullable(
    enum_z(eduIscedFields.enabled.map(({ code }) => code) as [string, ...string[]]),
    !eduResourceMeta.iscedField.required,
  )
  const eduResourceIscedLevel = zod_m_nullable(
    enum_z(eduIscedLevels.enabled.map(({ code }) => code) as [string, ...string[]]),
    !eduResourceMeta.iscedLevel.required,
  )
  const eduResourceType = zod_m_nullable(
    enum_z(eduResourceTypes.enabled.map(({ code }) => code) as [string, ...string[]]),
    !eduResourceMeta.type.required,
  )
  const eduResourceLanguage = zod_m_nullable(
    enum_z(contentLanguages.enabled.map(({ code }) => code) as [string, ...string[]]),
    !eduResourceMeta.language.required,
  )
  const eduResourceLicense = zod_m_nullable(
    enum_z(contentLicenses.enabled.map(({ code }) => code) as [string, ...string[]]),
    !eduResourceMeta.license.required,
  )
  const eduResourcePublicationDate = zod_m_nullable(
    object({
      month: number().int().min(1).max(12).nullable(),
      year: number().int().min(eduResourceMeta.publicationDate.sinceYear),
    }),
    !eduResourceMeta.publicationDate.required,
  )

  const eduResourceBloomLearningOutcomes = array(eduResourceBloomLearningOutcome)
    .min(eduResourceMeta.bloomLearningOutcomes.amount.min)
    .max(eduResourceMeta.bloomLearningOutcomes.amount.max)

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
