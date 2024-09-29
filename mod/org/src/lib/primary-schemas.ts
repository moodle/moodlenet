import { url_or_file_id_schema, url_string_schema } from '@moodle/lib-types'
import { object, string } from 'zod'
import { OrgPrimaryMsgSchemaConfigs } from '../types'

export function getOrgPrimarySchemas({ info }: OrgPrimaryMsgSchemaConfigs) {
  const name = string().trim().min(info.name.min).max(info.name.max)
  const logo = url_or_file_id_schema()
  const smallLogo = url_or_file_id_schema()
  const websiteUrl = url_string_schema
  const copyright = string().trim().max(info.copyright.max)
  const physicalAddress = string().trim().max(info.physicalAddress.max)

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
