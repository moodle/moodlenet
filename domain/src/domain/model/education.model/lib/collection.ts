import { single_line_string_schema } from '@moodle/lib-types'
import defaultsDeep from 'lodash-es/defaultsDeep'
import type { z } from 'zod'
import { object, string } from 'zod'
import { adoptAssetFormSchema } from '../../../../lib'
import { eduCollectionSchemaConfigs, eduCollectionSchemaConfigsOverrides } from '../types'

export type collectionSchema = ReturnType<typeof getCollectionSchemas>['collection']
export type collectionForm = z.infer<collectionSchema>

export type applyImageFormSchema = ReturnType<typeof getCollectionSchemas>['applyImage']
export type applyImageForm = z.infer<applyImageFormSchema>

export type collectionSchemasDeps = {
  eduCollectionSchemaConfigs: eduCollectionSchemaConfigs
  overrides: eduCollectionSchemaConfigsOverrides
}

export function getCollectionSchemas({ eduCollectionSchemaConfigs, overrides }: collectionSchemasDeps) {
  const overriddenEduCollectionSchemaConfigs: eduCollectionSchemaConfigs = defaultsDeep(overrides, eduCollectionSchemaConfigs)
  const applyImage = object({ resourceImageForm: adoptAssetFormSchema })

  const title = string().trim().max(overriddenEduCollectionSchemaConfigs.title.max).min(overriddenEduCollectionSchemaConfigs.title.min).pipe(single_line_string_schema)
  const description = string().trim().max(overriddenEduCollectionSchemaConfigs.description.max).min(overriddenEduCollectionSchemaConfigs.description.min)

  const raw = { title, description }
  const collection = object(raw)

  return {
    overriddenEduCollectionSchemaConfigs,
    raw,
    applyImage,
    collection,
  }
}
