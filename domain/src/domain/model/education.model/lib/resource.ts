import { single_line_string_schema, zod_m_nullable } from '@moodle/lib-types'
import { defaultsDeep } from 'lodash'
import { array, number, object, string } from 'zod'
import { adoptAssetFormSchema, adoptValuedAssetFormSchema } from '../../../../lib'
import { enabledContentCategories } from '../../content.model'
import { getContentCategoriesSchemas } from '../../content.model/lib'
import { eduResourceSchemaConfigs, eduResourceSchemaConfigsOverrides, enabledEduCategories } from '../types'
import { getEduCategoriesSchemas } from './categories'

export type resourceSchemasDeps = {
  enabledEduCategories: enabledEduCategories
  enabledContentCategories: enabledContentCategories
  eduResourceSchemaConfigs: eduResourceSchemaConfigs
  overrides: eduResourceSchemaConfigsOverrides
}

export function getResourceSchemas({ eduResourceSchemaConfigs, overrides, enabledContentCategories, enabledEduCategories }: resourceSchemasDeps) {
  const overriddenEduResourceSchemaConfigs: eduResourceSchemaConfigs = defaultsDeep(overrides, eduResourceSchemaConfigs)

  const eduCategoriesSchema = getEduCategoriesSchemas({ bloomLearningOutcomes: overriddenEduResourceSchemaConfigs.bloomLearningOutcomes, enabledEduCategories })
  const contentCategoriesSchema = getContentCategoriesSchemas({ enabledContentCategories })

  const applyImage = object({ resourceImageForm: adoptAssetFormSchema })

  const title = string().trim().max(overriddenEduResourceSchemaConfigs.title.max).min(overriddenEduResourceSchemaConfigs.title.min).pipe(single_line_string_schema)
  const description = string().trim().max(overriddenEduResourceSchemaConfigs.description.max).min(overriddenEduResourceSchemaConfigs.description.min)
  const iscedField = zod_m_nullable(eduCategoriesSchema.iscedFields, !overriddenEduResourceSchemaConfigs.iscedField.required)
  const iscedLevel = zod_m_nullable(eduCategoriesSchema.iscedLevels, !overriddenEduResourceSchemaConfigs.iscedLevel.required)
  const type = zod_m_nullable(eduCategoriesSchema.resourceTypes, !overriddenEduResourceSchemaConfigs.type.required)
  const language = zod_m_nullable(contentCategoriesSchema.language, !overriddenEduResourceSchemaConfigs.language.required)
  const license = zod_m_nullable(contentCategoriesSchema.license, !overriddenEduResourceSchemaConfigs.license.required)

  const publicationDate = zod_m_nullable(
    object({
      month: number().int().min(1).max(12).nullable(),
      year: number().int().min(overriddenEduResourceSchemaConfigs.publicationDate.sinceYear),
    }),
    !overriddenEduResourceSchemaConfigs.publicationDate.required,
  )

  const bloomLearningOutcomes = array(eduCategoriesSchema.bloomLearningOutcome)
    .min(overriddenEduResourceSchemaConfigs.bloomLearningOutcomes.amount.min)
    .max(overriddenEduResourceSchemaConfigs.bloomLearningOutcomes.amount.max)

  const createNew = object({ asset: adoptValuedAssetFormSchema })
  const raw = {
    title,
    description,
    bloomLearningOutcomes,
    iscedField,
    iscedLevel,
    type,
    language,
    license,
    publicationDate,
  }
  const resource = object(raw)

  return {
    raw,
    eduCategoriesSchema,
    contentCategoriesSchema,
    overriddenEduResourceSchemaConfigs,
    applyImage,
    createNew,
    resource,
  }
}
