import { single_line_string_schema } from '@moodle/lib-types'
import { enum as enum_z, object, string } from 'zod'
import { eduResourceSchemaConfigs, enabledEduCategories } from '../types'

export type eduCategoriesSchemas = ReturnType<typeof getEduCategoriesSchemas>

export type eduCategoriesSchemasDeps = {
  enabledEduCategories: enabledEduCategories
  bloomLearningOutcomes: eduResourceSchemaConfigs['bloomLearningOutcomes']
}

export function getEduCategoriesSchemas({ enabledEduCategories, bloomLearningOutcomes }: eduCategoriesSchemasDeps) {
  const iscedFields = enum_z(enabledEduCategories.iscedFields.map(({ code }) => code) as [string, ...string[]])
  const iscedLevels = enum_z(enabledEduCategories.iscedLevels.map(({ code }) => code) as [string, ...string[]])
  const resourceTypes = enum_z(enabledEduCategories.resourceTypes.map(({ code }) => code) as [string, ...string[]])
  const bloomLearningOutcome = object({
    level: string(),
    verb: string(),
    sentence: string().trim().min(bloomLearningOutcomes.sentence.min).max(bloomLearningOutcomes.sentence.max).pipe(single_line_string_schema),
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

  return {
    iscedFields,
    iscedLevels,
    resourceTypes,
    bloomLearningOutcome,
  }
}
