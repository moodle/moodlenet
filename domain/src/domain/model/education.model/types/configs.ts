import { deep_partial_props, int, serializable_object, valid } from '@moodle/lib-types'
import { bloomCognitive, bloomCognitiveLevel, iscedField, iscedLevel, resourceType } from './edu-categories'

export type educationConfigs = {
  // NO enabledCategories: enabledEduCategories
  schema: eduSchemaConfigs
}

export type enabledEduCategories = {
  iscedFields: ({ code: string } & iscedField)[]
  iscedLevels: ({ code: string } & iscedLevel)[]
  resourceTypes: ({ code: string } & resourceType)[]
  bloomCognitives: ({ level: bloomCognitiveLevel } & bloomCognitive)[]
}

export type eduResourceSchemaConfigsOverrides = deep_partial_props<eduResourceSchemaConfigs> & serializable_object
export type eduResourceSchemaConfigs = {
  title: valid.i_natMinMax
  description: valid.i_natMinMax
  bloomLearningOutcomes: {
    amount: valid.i_natMinMax
    sentence: valid.i_natMinMax
  }
  iscedField: valid.opt_required
  iscedLevel: valid.opt_required
  type: valid.opt_required
  language: valid.opt_required
  license: valid.opt_required
  publicationDate: valid.opt_required & {
    sinceYear: int
  }
}

export type eduCollectionSchemaConfigsOverrides = deep_partial_props<eduCollectionSchemaConfigs> & serializable_object
export type eduCollectionSchemaConfigs = {
  title: valid.i_natMinMax
  description: valid.i_natMinMax
}

export type eduSchemaConfigs = {
  collection: eduCollectionSchemaConfigs
  resource: eduResourceSchemaConfigs
}
