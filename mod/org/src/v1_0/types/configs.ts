import { url_string } from '@moodle/lib-types'
import { OrgPrimaryMsgSchemaConfigs } from './primary-schemas'

export interface OrgInfo {
  name: string
  logo: url_string
  smallLogo: url_string
  copyright: string
  physicalAddress: string
  websiteUrl: url_string
}

export interface Configs {
  info: OrgInfo
  orgPrimaryMsgSchemaConfigs: OrgPrimaryMsgSchemaConfigs
}
