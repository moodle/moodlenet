import { email_address, url_string } from '@moodle/lib-types'

export interface OrgInfo {
  name: string
  logo: url_string
  smallLogo: url_string
  copyright: null | string
}

export interface OrgAddresses {
  physicalAddress: null | string
  websiteUrl: url_string
  emailAddress: null | email_address
}

export interface Configs {
  info: OrgInfo
  addresses: OrgAddresses
}
