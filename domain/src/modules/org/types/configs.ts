import { url_or_file_id, url_string } from '@moodle/lib-types'
import { OrgPrimaryMsgSchemaConfigs } from './primary-schemas'

export interface OrgInfo {
  name: string
  logo: url_or_file_id
  smallLogo: url_or_file_id
  copyright: string
  physicalAddress: string
  websiteUrl: url_string
}

export interface Configs {
  info: OrgInfo
  orgPrimaryMsgSchemaConfigs: OrgPrimaryMsgSchemaConfigs
}
