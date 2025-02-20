import { valid } from '@moodle/lib-types'
import { eduCollectionSchemaConfigsOverrides, eduResourceSchemaConfigsOverrides } from '../../education.model'
import { pointSystem } from './point-system'

export type publishEduSchemaOverrides = {
  collection: eduCollectionSchemaConfigsOverrides
  resource: eduResourceSchemaConfigsOverrides
}

export type configs = {
  schema: {
    publishEduOverrides: publishEduSchemaOverrides
    moodlenetInfo: moodlenetInfoSchemaConfigs
  }
  info: moodlenetInfo
  pointSystem: pointSystem
}

export type moodlenetInfo = {
  title: string
  subtitle: string
  logo: moo.content.asset.maybe
  smallLogo: moo.content.asset.maybe
}

export type moodlenetInfoSchemaConfigs = {
  title: valid.i_natMinMax
  subtitle: valid.i_natMinMax
}
