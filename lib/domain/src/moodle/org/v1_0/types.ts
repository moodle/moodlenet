import { email_address } from '@moodle/lib-types'

export interface OrgInfo {
  name: string
  logo: string
  smallLogo: string
  copyright: string
}

export interface OrgAddresses {
  physicalAddress: string
  websiteUrl: string
  emailAddress: email_address
}
