import { object, string } from 'zod'
import { OrgPrimaryMsgSchemaConfigs } from '../types'

export function getOrgPrimarySchemas({ info }: OrgPrimaryMsgSchemaConfigs) {
  const name = string().min(info.name.min).max(info.name.max)
  const logo = string().min(info.logo.min).max(info.logo.max)
  const smallLogo = string().min(info.smallLogo.min).max(info.smallLogo.max)
  const copyright = string().min(info.copyright.min).max(info.copyright.max)
  const physicalAddress = string().min(info.physicalAddress.min).max(info.physicalAddress.max)
  const websiteUrl = string().min(info.websiteUrl.min).max(info.websiteUrl.max)

  const orgInfoSchema = object({
    name,
    logo,
    smallLogo,
    copyright,
    physicalAddress,
    websiteUrl,
  }).partial()

  return {
    raw: {
      info: {
        name,
        logo,
        smallLogo,
        copyright,
        physicalAddress,
        websiteUrl,
      },
    },
    orgInfoSchema,
  }
}
