import { url_string } from '@moodle/lib-types'
import { maybeAsset } from '../../storage'
import { orgPrimaryMsgSchemaConfigs } from './primary-schemas'

export interface OrgInfo {
  name: string
  logo: maybeAsset
  smallLogo: maybeAsset
  copyright: string
  physicalAddress: string
  websiteUrl: url_string
}

export interface Configs {
  info: OrgInfo
  orgPrimaryMsgSchemaConfigs: orgPrimaryMsgSchemaConfigs
}
