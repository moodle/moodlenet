import { url_string } from '@moodle/lib-types'
import { asset } from '../../storage'
import { OrgPrimaryMsgSchemaConfigs } from './primary-schemas'

export interface OrgInfo {
  name: string
  logo: asset
  smallLogo: asset
  copyright: string
  physicalAddress: string
  websiteUrl: url_string
}

export interface Configs {
  info: OrgInfo
  orgPrimaryMsgSchemaConfigs: OrgPrimaryMsgSchemaConfigs
}
