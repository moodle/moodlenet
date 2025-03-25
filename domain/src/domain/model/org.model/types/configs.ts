import { url_string, valid } from '@moodle/lib-types'

export type orgSchemas = {
  general: generalSchemaConfig
  baseUserData: baseUserDataSchemaConfig
  orgInfo: orgInfoSchemaConfigs
}

export type generalSchemaConfig = {
  id: valid.i_posMinMax
  email: valid.i_posMax
  textSearch: valid.i_posMinMax
}

export type baseUserDataSchemaConfig = {
  password: valid.i_posMinMax
  displayName: valid.i_posMinMax
}

export type orgInfoSchemaConfigs = {
  websiteUrl: valid.i_natMax
  physicalAddress: valid.i_natMinMax
  copyright: valid.i_natMinMax
}

export type orgConfigs = {
  info: orgInfo
}
export type orgInfo = {
  websiteUrl: '' | url_string
  physicalAddress: null | string
  copyright: null | string
}
