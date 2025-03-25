import { valid } from '@moodle/lib-types'
import { eduCollectionSchemaConfigsOverrides, eduResourceSchemaConfigsOverrides } from '../../education.model'
import { pointSystem } from './point-system'

export type publishEduSchemaOverrides = {
  collection: eduCollectionSchemaConfigsOverrides
  resource: eduResourceSchemaConfigsOverrides
}

export type moodlenetSchemas = {
  publishEduOverrides: publishEduSchemaOverrides
  moodlenetInfo: moodlenetInfoSchemaConfigs
}

export type moodlenetConfigs = {
  info: moodlenetInfo
  pointSystem: pointSystem
}

export type moodlenetInfo = {
  title: string
  subtitle: string
  logo: moo.def.content.asset.optional
  smallLogo: moo.def.content.asset.optional
}

export type moodlenetInfoSchemaConfigs = {
  title: valid.i_natMinMax
  subtitle: valid.i_natMinMax
}
